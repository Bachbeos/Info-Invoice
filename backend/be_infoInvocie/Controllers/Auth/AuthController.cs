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

        if (result.Code == 200)
        {
            return Ok(result);
        }

        return Unauthorized(result);
    }

    // GET: api/auth/provider-configs
    [HttpGet("provider-configs")]
    public async Task<IActionResult> GetProviderConfigs([FromQuery] int providerId)
    {
        if (providerId <= 0)
        {
            return BadRequest(new { message = "Thiếu thông tin providerId hợp lệ" });
        }

        var configs = await _authService.GetProviderConfigsAsync(providerId);
        return Ok(configs);
    }
}
