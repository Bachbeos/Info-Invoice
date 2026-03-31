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

    public async Task<(bool IsSuccess, int SessionId)> AuthenticateAndSaveSessionAsync(LoginRequest request)
    {
        // 1. Giả định xác thực thành công (TODO: Call API Provider thật tại đây)
        bool isExternalAuthValid = true; 
        if (!isExternalAuthValid) return (false, 0);
    
        // 2. Băm mật khẩu để bảo mật
        string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);
    
        // 3. Tìm session cũ để tránh trùng lặp (Logic Upsert)
        var existingSession = await _repository.GetExistingSessionAsync(request.ProviderId, request.MaDvcs);

        int currentSessionId;

        if (existingSession != null)
        {
            existingSession.Url = request.Url;
            existingSession.Username = request.Username;
            existingSession.Password = hashedPassword;
            existingSession.TenantId = request.TenantId;
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
                CreatedAt = DateTime.Now
            };
            var saved = await _repository.SaveSessionAsync(newSession);
            currentSessionId = saved.Id;
        }

        // 4. Tạo Refresh Token
        var token = new RefreshToken {
            SessionId = currentSessionId,
            Token = Guid.NewGuid().ToString(),
            ExpiresAt = DateTime.Now.AddDays(7),
            CreatedAt = DateTime.Now
        };
        await _repository.SaveRefreshTokenAsync(token);
        return (true, currentSessionId);
    }
    
    public async Task<bool> IssueInvoiceAsync(InvoiceIssuanceDto dto, int sessionId)
    {
        // TƯ DUY: Khởi tạo đối tượng cha (Invoice) và gán các đối tượng con trực tiếp
        // EF Core sẽ tự động lo việc Insert vào 3 bảng và gán ID liên kết (Foreign Key)
        var invoice = new Invoice
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
            
            // Map thông tin ngân hàng bên bán (Seller Bank)
            BankAccount = dto.BankAccount,
            BankName = dto.BankName,

            Status = false, // Mặc định false, chờ xử lý API từ nhà cung cấp sau
            CreatedAt = DateTime.Now,

            // MAP THÔNG TIN NGƯỜI MUA (Quan hệ 1-1)
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

            // MAP DANH SÁCH SẢN PHẨM (Quan hệ 1-n)
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

        // Thực hiện lưu một lượt cả 3 bảng (Atomicity)
        return await _repository.CreateInvoiceAsync(invoice);
    }
}