using be_infoInvoice.Core.DTOs;
using be_infoInvoice.Interfaces.Auth;
using be_infoInvoice.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace be_infoInvoice.Controllers.Auth;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IJwtService _jwtService;

    public AuthController(IAuthService authService, IJwtService jwtService)
    {
        _authService = authService;
        _jwtService  = jwtService;
    }

    // GET: api/auth/providers
    [HttpGet("providers")]
    public async Task<IActionResult> GetProviders()
    {
        var providers = await _authService.GetAvailableProvidersAsync();
        return Ok(providers);
    }

    // POST: api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.AuthenticateAndSaveSessionAsync(request);

        if (result.IsSuccess)
        {
            var token = _jwtService.GenerateToken(result.SessionId);
            return Ok(new
            {
                code        = 200,
                message     = "Kết nối nhà cung cấp thành công!",
                accessToken = token,
                timestamp   = DateTime.Now
            });
        }

        return Unauthorized(new { code = 401, message = "Thông tin đăng nhập hoặc kết nối không chính xác." });
    }
}
