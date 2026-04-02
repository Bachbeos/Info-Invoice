using System.Text.Json;
using be_infoInvoice.Core.DTOs;
using be_infoInvoice.Database.Entities;
using be_infoInvoice.Interfaces;

namespace be_infoInvoice.Services;

public class TctService : ITctService
{
    private readonly ITctRepository _repository;

    public TctService(ITctRepository repository)
    {
        _repository = repository;
    }

    public async Task<TctLoginResponse> LoginAsync(TctLoginRequest request)
    {
        // 1. Kiểm tra tài khoản trong DB (Mô phỏng check user/pass TCT)
        var dummyAccount = await _repository.GetAccountByTaxCodeAsync("0101234567") ??
                           await _repository.SaveAccountAsync(new TctAccount
                           {
                               TaxCode = "0101234567",
                               Username = "admin_tct",
                               Password = "password_tct"
                           });

        if (request.username != dummyAccount.Username || request.password != dummyAccount.Password)
        {
            return new TctLoginResponse
            {
                statusCode = 401,
                message = "Tài khoản hoặc mật khẩu TCT không đúng."
            };
        }

        // 2. Giả lập gọi API TCT thành công trả về chuỗi Session
        string dummySessionToken = Guid.NewGuid().ToString("N");
        
        // 3. Lưu vào DB
        await _repository.SaveSessionAsync(dummyAccount.Id, dummySessionToken);

        return new TctLoginResponse
        {
            statusCode = 200,
            content = new TctSessionData { session = dummySessionToken },
            message = "Thành công"
        };
    }

    public async Task<TctInvoiceListResponse> SyncInvoicesAsync(TctSyncRequest request)
    {
        // 1. Validate Session
        var session = await _repository.GetValidSessionAsync(request.session);
        if (session == null)
            throw new Exception("Session không hợp lệ hoặc đã hết hạn.");

        // 2. Giả lập Dữ liệu TCT trả về
        var mockDatas = new List<TctInvoiceDto>
        {
            new TctInvoiceDto
            {
                id = Guid.NewGuid().ToString("N"),
                hsgoc = "HS_" + DateTime.Now.Ticks,
                tdlap = DateTime.Parse(request.fromDate),
                ttxly = "5", tthai = "1", mhdon = "MHDON001",
                nbmst = "0101234567", nbten = "Công ty phát hành", nbdchi = "Hà Nội",
                nmmst = "0109999999", nmten = "Công ty mua hàng", nmdchi = "Hồ Chí Minh",
                khmshdon = "1C22TBB", khhdon = "C22TBB", shdon = "0000123",
                tgtcthue = 1000000, tgtthue = 100000, tgtttbso = 1100000, dvtte = "VND"
            }
        };

        // 3. Map sang Entities và Lưu vào DB
        var entities = mockDatas.Select(d => new TctInvoice
        {
            TctId = d.id, Hsgoc = d.hsgoc, InvoiceType = (byte)request.invoiceType,
            NgayLap = d.tdlap, Ttxly = d.ttxly, Tthai = d.tthai,
            Nbmst = d.nbmst, Nbten = d.nbten, Nbdchi = d.nbdchi,
            Nmmst = d.nmmst, Nmten = d.nmten, Nmdchi = d.nmdchi,
            Khmshdon = d.khmshdon, Khhdon = d.khhdon, Shdon = d.shdon,
            Mhdon = d.mhdon, Tgtcthue = d.tgtcthue, Tgtthue = d.tgtthue,
            Tgtttbso = d.tgtttbso, Dvtte = d.dvtte
        }).ToList();

        await _repository.BulkUpsertInvoicesAsync(entities);

        return new TctInvoiceListResponse
        {
            total = mockDatas.Count,
            datas = mockDatas
        };
    }

    public async Task<object> GetInvoiceDetailAsync(TctDetailRequest request)
    {
        // 1. Validate Session
        var session = await _repository.GetValidSessionAsync(request.session);
        if (session == null) throw new Exception("Session không hợp lệ.");

        // 2. Validate Invoice Existence
        var inv = await _repository.GetInvoiceByTctIdAsync(request.id);
        if (inv == null) throw new Exception("Không tìm thấy hóa đơn này trên hệ thống.");

        // 3. Giả lập tạo JSON chi tiết
        var mockDetail = new
        {
            THDon = "01GTKT", KHMSHDon = inv.Khmshdon, KHHDon = inv.Khhdon, SHDon = inv.Shdon,
            NLap = inv.NgayLap?.ToString("yyyy-MM-dd"), DVTTeloại = inv.Dvtte,
            NBan = new { Ten = inv.Nbten, MST = inv.Nbmst, DChi = inv.Nbdchi },
            NMua = new { Ten = inv.Nmten, MST = inv.Nmmst, DChi = inv.Nmdchi },
            HHDVu = new[] {
                new { THHDVu = "Phần mềm", SLuong = 1, DGia = inv.Tgtcthue, ThTien = inv.Tgtcthue }
            },
            TgTCThue = inv.Tgtcthue, TgTThue = inv.Tgtthue, TgTTTBSo = inv.Tgtttbso
        };

        string jsonString = JsonSerializer.Serialize(mockDetail);
        
        // 4. Lưu lại json đó vào Database
        await _repository.UpdateInvoiceDetailAsync(request.id, jsonString);

        return mockDetail;
    }

    public async Task<string> GetInvoiceXmlAsync(TctXmlRequest request)
    {
        // 1. Validate Session
        var session = await _repository.GetValidSessionAsync(request.session);
        if (session == null) throw new Exception("Session không hợp lệ.");
        
        // 2. Format a dummy XML matching requirements
        string mockXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><HDoan><DLHDon><TTChung>" + 
                         $"<SHDon>{request.shdon}</SHDon><KHHDon>{request.khhdon}</KHHDon>" +
                         "</TTChung></DLHDon></HDoan>";

        // 3. Save to database
        await _repository.UpdateInvoiceXmlAsync(request.id, mockXml);

        return mockXml;
    }
}
