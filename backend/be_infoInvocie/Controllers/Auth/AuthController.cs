using be_infoInvoice.Core.DTOs;
using be_infoInvoice.Interfaces.Auth;
using Microsoft.AspNetCore.Mvc;

namespace be_infoInvoice.Controllers.Auth;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
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
            return Ok(result.Data);
        }

        return Unauthorized(result.Data);
    }

    // GET: api/auth/generate-hash (DÙNG ĐỂ TEST SINH MẬT KHẨU BCRYPT TẠM THỜI)
    [HttpGet("generate-hash")]
    public IActionResult GenerateHash([FromQuery] string password)
    {
        if (string.IsNullOrEmpty(password)) return BadRequest("Nhập password.");
        return Ok(new
        {
            password = password,
            bcryptHash = BCrypt.Net.BCrypt.HashPassword(password)
        });
    }
}
