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
        // Giả định xác thực thành công
        bool isExternalAuthValid = true; 
        if (!isExternalAuthValid) return false;
    
        // Băm mật khẩu để bảo mật
        string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);
    
        // Tìm session cũ
        var existingSession = await _repository.GetExistingSessionAsync(request.ProviderId, request.MaDvcs);

        int currentSessionId;

        if (existingSession != null)
        {
            // CẬP NHẬT: Gán giá trị mới cho object cũ
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
            // TẠO MỚI: Khởi tạo object mới
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

        // Tạo Refresh Token dựa trên currentSessionId (dù là mới hay cũ)
        var token = new RefreshToken {
            SessionId = currentSessionId,
            Token = Guid.NewGuid().ToString(),
            ExpiresAt = DateTime.Now.AddDays(7),
            CreatedAt = DateTime.Now // Nhớ gán cả ngày tạo cho token nếu DB yêu cầu
        };
        await _repository.SaveRefreshTokenAsync(token);

        return true;
    }
}