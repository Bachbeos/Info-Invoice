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
        var providers = await _repository.GetProvidersAsync();
        return providers;
    }

    public async Task<bool> AuthenticateAndSaveSessionAsync(LoginRequest request)
    {
        // BƯỚC 1: Tư duy thực tế - Tại đây bạn sẽ gọi API của nhà cung cấp (EasyInvoice, v.v.)
        // Để xác thực xem Username/Password có đúng không. 
        // Hiện tại chúng ta giả định là luôn đúng (true).
        bool isExternalAuthValid = true; 

        if (!isExternalAuthValid) return false;

        // BƯỚC 2: Chuyển đổi từ DTO sang Entity (InvoiceSession)
        var session = new InvoiceSession
        {
            ProviderId = request.ProviderId,
            Url = request.Url,
            MaDvcs = request.MaDvcs,
            Username = request.Username,
            Password = request.Password, // Lưu ý: Thực tế nên mã hóa hoặc bảo mật hơn
            TenantId = request.TenantId,
            CreatedAt = DateTime.Now
        };

        // BƯỚC 3: Lưu Session vào Database thông qua Repository
        var savedSession = await _repository.SaveSessionAsync(session);

        // BƯỚC 4: Tạo một Refresh Token giả lập để duy trì phiên
        var refreshToken = new RefreshToken
        {
            SessionId = savedSession.Id,
            Token = Guid.NewGuid().ToString(), // Tạo một chuỗi ngẫu nhiên làm token
            ExpiresAt = DateTime.Now.AddDays(7), // Token có hạn 7 ngày
            IsRevoked = false,
            CreatedAt = DateTime.Now
        };

        // BƯỚC 5: Lưu Refresh Token
        await _repository.SaveRefreshTokenAsync(refreshToken);

        return true;
    }
}