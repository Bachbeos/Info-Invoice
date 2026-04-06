using be_infoInvoice.Core.DTOs;
using be_infoInvoice.Database.Entities;
using be_infoInvoice.Interfaces.Auth;

namespace be_infoInvoice.Services.Auth;

public class AuthService : IAuthService
{
    private readonly IAuthRepository _repository;

    public AuthService(IAuthRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Provider>> GetAvailableProvidersAsync()
    {
        return await _repository.GetProvidersAsync();
    }
    
    /// Xác thực và lưu phiên làm việc. Trả về SessionId để tạo JWT Token.
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
            var newSession = new InvoiceSession
            {
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
        var token = new RefreshToken
        {
            SessionId = currentSessionId,
            Token = Guid.NewGuid().ToString(),
            ExpiresAt = DateTime.Now.AddDays(7),
            CreatedAt = DateTime.Now
        };
        await _repository.SaveRefreshTokenAsync(token);

        return (true, currentSessionId);
    }
}
