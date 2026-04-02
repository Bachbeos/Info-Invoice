using be_infoInvoice.Core.DTOs;
using be_infoInvoice.Database.Entities;
using be_infoInvoice.Interfaces;

namespace be_infoInvoice.Services;

public class InvoiceService : IInvoiceService
{
    private readonly IInvoiceRepository _repository;

    public InvoiceService(IInvoiceRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Provider>> GetAvailableProvidersAsync()
    {
        return await _repository.GetProvidersAsync();
    }

    /// <summary>
    /// Xác thực và lưu phiên làm việc. Trả về SessionId để tạo JWT Token.
    /// </summary>
    public async Task<(bool IsSuccess, int SessionId)> AuthenticateAndSaveSessionAsync(LoginRequest request)
    {
        // 1. Giả định xác thực thành công (Sau này call API của EasyInvoice/SInvoice tại đây)
        bool isExternalAuthValid = true; 
        if (!isExternalAuthValid) return (false, 0);
    
        // 2. Băm mật khẩu để lưu trữ an toàn
        string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);
    
        // 3. Logic Upsert: Nếu tồn tại Session cũ thì cập nhật, chưa có thì tạo mới
        var existingSession = await _repository.GetExistingSessionAsync(request.ProviderId, request.MaDvcs);
        int currentSessionId;

        if (existingSession != null)
        {
            existingSession.Url = request.Url;
            existingSession.Username = request.Username;
            existingSession.Password = hashedPassword;
            existingSession.TenantId = request.TenantId;
            existingSession.ApiKey = request.Key;
            existingSession.CreatedAt = DateTime.Now;

            await _repository.UpdateSessionAsync(existingSession);
            currentSessionId = existingSession.Id;
        }
        else
        {
            var newSession = new InvoiceSession {
                ProviderId = request.ProviderId,
                Url = request.Url,
                MaDvcs = request.MaDvcs,
                Username = request.Username,
                Password = hashedPassword,
                TenantId = request.TenantId,
                ApiKey = request.Key,
                CreatedAt = DateTime.Now
            };
            var saved = await _repository.SaveSessionAsync(newSession);
            currentSessionId = saved.Id;
        }

        // 4. Lưu Refresh Token để duy trì đăng nhập
        var token = new RefreshToken {
            SessionId = currentSessionId,
            Token = Guid.NewGuid().ToString(),
            ExpiresAt = DateTime.Now.AddDays(7),
            CreatedAt = DateTime.Now
        };
        await _repository.SaveRefreshTokenAsync(token);

        return (true, currentSessionId);
    }
    
    /// <summary>
    /// PHÁT HÀNH MỚI: Lưu hóa đơn gốc (InvoiceType = 1)
    /// </summary>
    public async Task<bool> IssueInvoiceAsync(InvoiceIssuanceDto dto, int sessionId)
    {
        var invoice = MapBaseInvoice(dto, sessionId);
        invoice.InvoiceType = 1; // Hóa đơn gốc
        
        return await _repository.CreateInvoiceAsync(invoice);
    }

    /// <summary>
    /// THAY THẾ: Lưu hóa đơn thay thế (InvoiceType = 2)
    /// </summary>
    public async Task<bool> ReplaceInvoiceAsync(InvoiceReplaceDto dto, int sessionId)
    {
        var invoice = MapBaseInvoice(dto, sessionId);
        invoice.InvoiceType = 2; // Hóa đơn thay thế
        invoice.TransactionIdOld = dto.TransactionIdOld; // Truy vết ID cũ
        invoice.NoteDesc = dto.Note; // Lý do thay thế

        return await _repository.CreateInvoiceAsync(invoice);
    }

    /// <summary>
    /// ĐIỀU CHỈNH: Lưu hóa đơn điều chỉnh (InvoiceType = 3)
    /// </summary>
    public async Task<bool> AdjustInvoiceAsync(InvoiceAdjustDto dto, int sessionId)
    {
        var invoice = MapBaseInvoice(dto, sessionId);
        invoice.InvoiceType = 3; // Hóa đơn điều chỉnh
        invoice.TransactionIdOld = dto.TransactionIdOld; // Truy vết ID cũ
        invoice.NoteDesc = dto.Note; // Lý do điều chỉnh

        return await _repository.CreateInvoiceAsync(invoice);
    }

    /// <summary>
    /// PRIVATE HELPER: Hàm dùng chung để Map dữ liệu từ DTO sang Entity.
    /// Giúp tránh lặp code (DRY Principle) và dễ bảo trì.
    /// </summary>
    private Invoice MapBaseInvoice(InvoiceIssuanceDto dto, int sessionId)
    {
        return new Invoice
        {
            SessionId = sessionId,
            TransactionId = dto.TransactionId,
            InvRef = dto.InvRef,
            PoNo = dto.PoNo,
            InvSubTotal = dto.InvSubTotal,
            InvVatRate = dto.InvVatRate,
            InvDiscAmount = dto.InvDiscAmount,
            InvVatAmount = dto.InvVatAmount,
            InvTotalAmount = dto.InvTotalAmount,
            PaidTp = dto.PaidTp,
            Note = dto.Note,
            ExchCd = dto.ExchCd,
            ExchRt = dto.ExchRt,
            BankAccount = dto.BankAccount,
            BankName = dto.BankName,
            Status = false, // Chờ gọi API nhà cung cấp thành công mới update true
            CreatedAt = DateTime.Now,

            // Map thông tin Người mua (1-1)
            Customer = new InvoiceCustomer
            {
                CustCd = dto.Customer.CustCd,
                CustNm = dto.Customer.CustNm,
                CustCompany = dto.Customer.CustCompany,
                TaxCode = dto.Customer.TaxCode,
                CustCity = dto.Customer.CustCity,
                CustDistrict = dto.Customer.CustDistrictName,
                CustAddrs = dto.Customer.CustAddrs,
                CustPhone = dto.Customer.CustPhone,
                CustBankAccount = dto.Customer.CustBankAccount,
                CustBankName = dto.Customer.CustBankName,
                Email = dto.Customer.Email,
                EmailCc = dto.Customer.EmailCC
            },

            // Map danh sách Sản phẩm (1-n)
            Items = dto.Products.Select(p => new InvoiceItem
            {
                ItmCd = p.ItmCd,
                ItmName = p.ItmName,
                ItmKnd = p.ItmKnd,
                UnitNm = p.UnitNm,
                Qty = p.Qty,
                Unprc = p.Unprc,
                Amt = p.Amt,
                DiscRate = p.DiscRate,
                DiscAmt = p.DiscAmt,
                VatRt = p.VatRt,
                VatAmt = p.VatAmt,
                TotalAmt = p.TotalAmt
            }).ToList()
        };
    }
    
    public async Task<InvoiceExportResponse> ExportInvoiceXmlAsync(string transactionId, int sessionId)
    {
        // 1. Lấy thông tin session từ Database để có Account nhà cung cấp
        var session = await _repository.GetSessionByIdAsync(sessionId);
        if (session == null) 
        {
            return new InvoiceExportResponse { Status = false, Message = "Phiên làm việc hết hạn hoặc không tồn tại." };
        }

        try 
        {
            // 2. TƯ DUY: Đây là nơi bro sẽ dùng HttpClient để gọi sang EasyInvoice
            // Ví dụ: var xmlData = await _easyInvoiceClient.DownloadXml(session.Url, transactionId, session.Username...);
        
            // GIẢ LẬP: Giả sử nhà cung cấp trả về chuỗi XML sau khi Base64
            // Nội dung gốc: <Root><Invoice>...</Invoice></Root>
            string base64Xml = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48SXZvaWNlPjxUcmFuc2FjdGlvbj5URVNUMDAxPC9UcmFuc2FjdGlvbj48L0l2b2ljZT4=";

            return new InvoiceExportResponse 
            { 
                Status = true, 
                Message = "Lấy dữ liệu XML thành công!", 
                Data = base64Xml 
            };
        }
        catch (Exception ex)
        {
            return new InvoiceExportResponse { Status = false, Message = "Lỗi kết nối nhà cung cấp: " + ex.Message };
        }
    }
    
    public async Task<TaxCheckResponse> CheckTaxStatusAsync(TaxCheckRequest request, int sessionId)
    {
        // 1. Validate số lượng MST (Tối đa 100 theo tài liệu)
        if (request.TaxCodes == null || request.TaxCodes.Count == 0)
            return new TaxCheckResponse { Status = false, Message = "Danh sách MST trống." };

        if (request.TaxCodes.Count > 100)
            return new TaxCheckResponse { Status = false, Message = "Chỉ được check tối đa 100 MST/lần." };

        // 2. GIẢ LẬP: Gọi API Thuế và nhận về List<object> (Data từ tài liệu bro gửi)
        // Sau này bro sẽ thay đoạn này bằng HttpClient gọi API thật
        var apiResults = request.TaxCodes.Select(mst => new TaxStatusResult
        {
            MaSoThue = mst,
            MasothueId = Guid.NewGuid().ToString(),
            TenCty = "Công ty Test " + mst,
            DiaChi = "Hà Nội, Việt Nam",
            Tthai = "00",
            TrangThaiHoatDong = "NNT đang hoạt động (đã được cấp GCN ĐKT)",
            LastUpdate = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
            NgayKiemTra = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")
        }).ToList();

        // 3. MAP sang Entity để chuẩn bị lưu vào Database
        var historyEntities = apiResults.Select(r => new TaxCheckHistory
        {
            SessionId = sessionId,
            TaxCode = r.MaSoThue,
            CompanyName = r.TenCty,
            Address = r.DiaChi,
            StatusCode = r.Tthai,
            StatusName = r.TrangThaiHoatDong,
            LastUpdateTax = r.LastUpdate,
            CheckedAt = DateTime.Now
        }).ToList();

        // 4. LƯU VÀO DB (Bulk Insert)
        var isSaved = await _repository.SaveTaxCheckHistoryAsync(historyEntities);

        return new TaxCheckResponse
        {
            Status = isSaved,
            Message = isSaved ? "Tra cứu và lưu lịch sử thành công" : "Tra cứu thành công nhưng lưu DB lỗi",
            Datas = apiResults
        };
    }
    
    public async Task<byte[]> PrintInvoicePdfAsync(string transactionId, int sessionId)
    {
        // 1. Lấy Session kèm theo ApiKey đã lưu
        var session = await _repository.GetSessionByIdAsync(sessionId);
        if (session == null)
        {
            throw new Exception("Không tìm thấy phiên làm việc này.");
        }

        // DỰ ÁN DEMO: Tạm thời cho qua nếu không có ApiKey (thực tế thì uncomment dòng dưới để ném Exception)
        if (string.IsNullOrEmpty(session.ApiKey))
        {
            // throw new Exception("Không tìm thấy ApiKey tích hợp cho phiên làm việc này.");
        }

        // 2. TƯ DUY: Dùng session.Url và session.ApiKey để gọi sang M-Invoice
        // var pdfData = await _mInvoiceClient.GetPdf(session.Url, session.ApiKey, transactionId);

        // GIẢ LẬP: Trả về một file PDF hợp lệ tối giản để trình duyệt/reader có thể mở được
        string pdfContent = 
            "%PDF-1.4\n" +
            "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n" +
            "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n" +
            "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 600 400] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n" +
            "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n" +
            "5 0 obj\n<< /Length 61 >>\nstream\nBT\n/F1 18 Tf\n50 300 Td\n(Hoa don mau - Transaction: " + transactionId + ") Tj\nET\nendstream\nendobj\n" +
            "xref\n0 6\n0000000000 65535 f \n0000000010 00000 n \n0000000060 00000 n \n0000000117 00000 n \n0000000244 00000 n \n0000000332 00000 n \n" +
            "trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n445\n%%EOF";

        return System.Text.Encoding.ASCII.GetBytes(pdfContent);
    }
}