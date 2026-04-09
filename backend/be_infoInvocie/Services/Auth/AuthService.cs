using be_infoInvoice.Core.DTOs;
using be_infoInvoice.Database.Entities;
using be_infoInvoice.Interfaces.Auth;
using be_infoInvoice.Interfaces;

namespace be_infoInvoice.Services.Auth;

public class AuthService : IAuthService
{
    private readonly IAuthRepository _repository;
    private readonly IJwtService _jwtService;

    public AuthService(IAuthRepository repository, IJwtService jwtService)
    {
        _repository = repository;
        _jwtService = jwtService;
    }

    public async Task<IEnumerable<Provider>> GetAvailableProvidersAsync()
    {
        return await _repository.GetProvidersAsync();
    }
    
    public async Task<ApiResult<object>> AuthenticateAndSaveSessionAsync(LoginRequest request)
    {
        if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password) || request.Password.Length < 6) {
            return ApiResult<object>.Failure(401, "Thông tin đăng nhập hoặc kết nối không chính xác");
        }

        var session = await _repository.GetExistingSessionAsync(request.ProviderId, request.MaDvcs);
        if (session != null)
        {
            if (session.Username != request.Username)
            {
                return ApiResult<object>.Failure(401, "Thông tin đăng nhập hoặc kết nối không chính xác");
            }

            if (!BCrypt.Net.BCrypt.Verify(request.Password, session.Password))
            {
                return ApiResult<object>.Failure(401, "Thông tin đăng nhập hoặc kết nối không chính xác");
            }

            session.Url = request.Url;
            session.TenantId = request.TenantId;
            session.ApiKey = request.Key;
            
            await _repository.UpdateSessionAsync(session);
        }
        else
        {
            return ApiResult<object>.Failure(401, "Thông tin đăng nhập hoặc kết nối không chính xác");

            //string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);
            //session = CreateNewSession(request, hashedPassword);
            //session = await _repository.SaveSessionAsync(session);
        }
        await CreateAndSaveRefreshToken(session.Id);

        var token = _jwtService.GenerateToken(session.Id);

        return ApiResult<object>.Success(new {AccessToken  = token}, "Kết nối nhà cung cấp thành công!");
    }

    //private void UpdateSessionProperties(InvoiceSession session, LoginRequest request, string hashedPassword) {
    //    session.Url = request.Url;
    //    session.Username = request.Username;
    //    session.Password = hashedPassword;
    //    session.TenantId = request.TenantId;
    //    session.ApiKey = request.Key;
    //    session.CreatedAt = DateTime.Now;
    //}

    //private InvoiceSession CreateNewSession(LoginRequest request, string hashedPassword) {
    //    return new InvoiceSession
    //    {
    //        ProviderId = request.ProviderId,
    //        Url = request.Url,
    //        MaDvcs = request.MaDvcs,
    //        Username = request.Username,
    //        Password = hashedPassword,
    //        TenantId = request.TenantId,
    //        ApiKey = request.Key,
    //        CreatedAt = DateTime.Now
    //    };
    //}

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
