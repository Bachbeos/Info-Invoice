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
    
    public async Task<(bool IsSuccess, int SessionId)> AuthenticateAndSaveSessionAsync(LoginRequest request)
    {
        if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password) || request.Password.Length < 6) {
            return (false, 0);
        }

        bool isExternalAuthValid = true;
        if (!isExternalAuthValid) return (false, 0);
        
        string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var session = await _repository.GetExistingSessionAsync(request.ProviderId, request.MaDvcs);

        if (session != null)
        {
            UpdateSessionProperties(session, request, hashedPassword);
            await _repository.UpdateSessionAsync(session);
        }
        else
        {
            session = CreateNewSession(request, hashedPassword);
            session = await _repository.SaveSessionAsync(session);
        }
        await CreateAndSaveRefreshToken(session.Id);
        return (true, session.Id);
    }

    private void UpdateSessionProperties(InvoiceSession session, LoginRequest request, string hashedPassword) {
        session.Url = request.Url;
        session.Username = request.Username;
        session.Password = hashedPassword;
        session.TenantId = request.TenantId;
        session.ApiKey = request.Key;
        session.CreatedAt = DateTime.Now;
    }

    private InvoiceSession CreateNewSession(LoginRequest request, string hashedPassword) {
        return new InvoiceSession
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
    }

    private async Task CreateAndSaveRefreshToken(int sessionId)
    {
        var token = new RefreshToken
        {
            SessionId = sessionId,
            Token = Guid.NewGuid().ToString(),
            ExpiresAt = DateTime.Now.AddDays(7),
            CreatedAt = DateTime.Now
        };
        await _repository.SaveRefreshTokenAsync(token);
    }
}
