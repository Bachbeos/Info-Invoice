using be_infoInvoice.Core.DTOs;
using be_infoInvoice.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace be_infoInvoice.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TctController : ControllerBase
{
    private readonly ITctService _tctService;

    public TctController(ITctService tctService)
    {
        _tctService = tctService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] TctLoginRequest request)
    {
        try
        {
            var result = await _tctService.LoginAsync(request);
            if (result.statusCode == 200)
                return Ok(result);
            return StatusCode(result.statusCode, result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("sync")]
    public async Task<IActionResult> SyncInvoices([FromBody] TctSyncRequest request)
    {
        try
        {
            var result = await _tctService.SyncInvoicesAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("detail")]
    public async Task<IActionResult> GetDetail([FromBody] TctDetailRequest request)
    {
        try
        {
            var result = await _tctService.GetInvoiceDetailAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("xml")]
    public async Task<IActionResult> GetXml([FromBody] TctXmlRequest request)
    {
        try
        {
            var result = await _tctService.GetInvoiceXmlAsync(request);
            // Có thể trả về chuỗi trực tiếp hoặc bọc trong object
            return Ok(new { xmlData = result });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
