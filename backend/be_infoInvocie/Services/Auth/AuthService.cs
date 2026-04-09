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
    public async Task<IEnumerable<object>> GetUserSuggestionsAsync(string username, int providerId)
    {
        return await _repository.GetUserSuggestionsAsync(username, providerId);
    }
    
    public async Task<ApiResult<object>> AuthenticateAndSaveSessionAsync(LoginRequest request)
    {
        if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password) || request.Password.Length < 6) {
            return ApiResult<object>.Failure(401, "Thông tin đăng nhập không chính xác");
        }

        var user = await _repository.GetUserByUsernameAsync(request.Username);
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
        {
            return ApiResult<object>.Failure(401, "Thông tin đăng nhập không chính xác");
        }

        if (user.Status != 1) 
        {
            return ApiResult<object>.Failure(403, "Tài khoản đã bị khóa");
        }

        if (string.IsNullOrEmpty(request.MaDvcs) || request.ProviderId <= 0)
        {
            return ApiResult<object>.Failure(400, "Thiếu thông tin Mã số thuế hoặc Nhà cung cấp");
        }

        var config = await _repository.GetAccessConfigDetailsAsync(user.Id, request.MaDvcs, request.ProviderId);
        if (config == null)
        {
            return ApiResult<object>.Failure(403, "Tài khoản không được cấu hình cho mã số thuế hoặc nhà cung cấp này");
        }

        await CreateAndSaveRefreshToken(user.Id);

        var token = _jwtService.GenerateToken(user.Id, config.TaxId, config.ProviderId);

        return ApiResult<object>.Success(new {AccessToken  = token}, "Đăng nhập thành công!");
    }

    private async Task CreateAndSaveRefreshToken(int userId)
    {
        var token = new RefreshToken
        {
            UserId = userId,
            Token = Guid.NewGuid().ToString(),
            ExpiresAt = DateTime.Now.AddDays(7),
            CreatedAt = DateTime.Now
        };
        await _repository.SaveRefreshTokenAsync(token);
    }
}
