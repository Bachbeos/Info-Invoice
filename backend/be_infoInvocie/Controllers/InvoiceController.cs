using be_infoInvoice.Core.DTOs;
using be_infoInvoice.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace be_infoInvoice.Controllers;

[Route("api/[controller]")]
[ApiController]
public class InvoiceController : ControllerBase
{
    private readonly IInvoiceService _invoiceService;

    // Tiêm Service vào thông qua Constructor
    public InvoiceController(IInvoiceService invoiceService)
    {
        _invoiceService = invoiceService;
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
        // Kiểm tra dữ liệu đầu vào cơ bản
        if (request == null) return BadRequest("Dữ liệu không hợp lệ.");

        // Gọi Service xử lý nghiệp vụ
        var isSuccess = await _invoiceService.AuthenticateAndSaveSessionAsync(request);

        if (isSuccess)
        {
            return Ok(new { 
                message = "Kết nối nhà cung cấp thành công!",
                timestamp = DateTime.Now 
            });
        }

        return Unauthorized(new { message = "Thông tin đăng nhập hoặc kết nối không chính xác." });
    }
}