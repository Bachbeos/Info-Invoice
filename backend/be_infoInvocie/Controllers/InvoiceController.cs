using System.Security.Claims;
using be_infoInvoice.Core.DTOs;
using be_infoInvoice.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace be_infoInvoice.Controllers;

[Route("api/[controller]")]
[ApiController]
public class InvoiceController : ControllerBase
{
    private readonly IInvoiceService _invoiceService;
    private readonly IConfiguration _configuration;
    private readonly IJwtService _jwtService;

    public InvoiceController(IInvoiceService invoiceService, IConfiguration configuration, IJwtService jwtService)
    {
        _invoiceService = invoiceService;
        _configuration = configuration;
        _jwtService = jwtService;
    }
    
    // GET: api/invoice/providers
    [HttpGet("providers")]
    public async Task<IActionResult> GetProviders()
    {
        var providers = await _invoiceService.GetAvailableProvidersAsync();
        return Ok(providers);
    }
    
    // POST: api/invoice/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (request == null) return BadRequest("Dữ liệu không hợp lệ.");

        var result = await _invoiceService.AuthenticateAndSaveSessionAsync(request);

        if (result.IsSuccess)
        {
            var token = _jwtService.GenerateToken(result.SessionId);

            return Ok(new { 
                message = "Kết nối nhà cung cấp thành công!",
                accessToken = token,
                timestamp = DateTime.Now,
            });
        }

        return Unauthorized(new { message = "Thông tin đăng nhập hoặc kết nối không chính xác." });
    }
    
    [Authorize] // QUAN TRỌNG: Phải có Authorize thì User.FindFirst mới có dữ liệu
    [HttpPost("issue")]
    public async Task<IActionResult> IssueInvoice([FromBody] InvoiceIssuanceDto request)
    {
        // 1. Lấy SessionId từ Claims (Đã được giải mã từ Bearer Token gửi lên)
        // Lưu ý: Tên Claim phải khớp với tên bro đặt khi tạo Token (thường là NameIdentifier hoặc "sub")
        var sessionIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                           ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(sessionIdStr))
        {
            return Unauthorized(new { message = "Không tìm thấy thông tin phiên làm việc. Vui lòng đăng nhập lại!" });
        }

        if (!int.TryParse(sessionIdStr, out int sessionId))
        {
            return BadRequest(new { message = "Phiên làm việc không hợp lệ." });
        }

        // 2. Gọi Service thực hiện lưu
        var result = await _invoiceService.IssueInvoiceAsync(request, sessionId);

        if (result)
        {
            return Ok(new 
            { 
                message = "Lưu hóa đơn vào hệ thống thành công!",
                transactionId = request.TransactionId 
            });
        }

        return BadRequest(new { message = "Lưu hóa đơn thất bại. Vui lòng kiểm tra lại dữ liệu." });
    }
}