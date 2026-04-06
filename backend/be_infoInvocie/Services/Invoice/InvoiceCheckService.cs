using be_infoInvoice.Core.DTOs;
using be_infoInvoice.Database.Entities;
using be_infoInvoice.Interfaces.Invoice;

namespace be_infoInvoice.Services.Invoice;

public class InvoiceCheckService : IInvoiceCheckService
{
    private readonly IInvoiceCheckRepository _repository;

    public InvoiceCheckService(IInvoiceCheckRepository repository)
    {
        _repository = repository;
    }

    public async Task<TaxCheckResponse> CheckTaxStatusAsync(TaxCheckRequest request, int sessionId)
    {
        // 1. Validate số lượng MST (Tối đa 100 theo tài liệu)
        if (request.TaxCodes == null || request.TaxCodes.Count == 0)
            return new TaxCheckResponse { Status = false, Message = "Danh sách MST trống." };

        if (request.TaxCodes.Count > 100)
            return new TaxCheckResponse { Status = false, Message = "Chỉ được check tối đa 100 MST/lần." };

        // 2. TODO: Thay bằng HttpClient gọi API Thuế thật
        var apiResults = request.TaxCodes.Select(mst => new TaxStatusResult
        {
            MaSoThue          = mst,
            MasothueId        = Guid.NewGuid().ToString(),
            TenCty            = "Công ty Test " + mst,
            DiaChi            = "Hà Nội, Việt Nam",
            Tthai             = "00",
            TrangThaiHoatDong = "NNT đang hoạt động (đã được cấp GCN ĐKT)",
            LastUpdate        = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
            NgayKiemTra       = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")
        }).ToList();

        // 3. Map sang Entity để lưu lịch sử
        var historyEntities = apiResults.Select(r => new TaxCheckHistory
        {
            SessionId     = sessionId,
            TaxCode       = r.MaSoThue,
            CompanyName   = r.TenCty,
            Address       = r.DiaChi,
            StatusCode    = r.Tthai,
            StatusName    = r.TrangThaiHoatDong,
            LastUpdateTax = r.LastUpdate,
            CheckedAt     = DateTime.Now
        }).ToList();

        // 4. Bulk Insert vào DB
        var isSaved = await _repository.SaveTaxCheckHistoryAsync(historyEntities);

        return new TaxCheckResponse
        {
            Status  = isSaved,
            Message = isSaved ? "Tra cứu và lưu lịch sử thành công" : "Tra cứu thành công nhưng lưu DB lỗi",
            Datas   = apiResults
        };
    }
}
