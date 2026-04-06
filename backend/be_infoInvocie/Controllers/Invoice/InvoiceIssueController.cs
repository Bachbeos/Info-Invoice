using System.Security.Claims;
using be_infoInvoice.Core.DTOs;
using be_infoInvoice.Interfaces.Invoice;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace be_infoInvoice.Controllers.Invoice;

[Route("api/invoice")]
[ApiController]
[Authorize]
public class InvoiceIssueController : ControllerBase
{
    private readonly IInvoiceIssueService _service;

    public InvoiceIssueController(IInvoiceIssueService service)
    {
        _service = service;
    }

    private int? GetSessionId()
    {
        var str = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                  ?? User.FindFirst("sub")?.Value;
        return int.TryParse(str, out int id) ? id : null;
    }

    // POST: api/invoice/issue
    [HttpPost("issue")]
    public async Task<IActionResult> IssueInvoice([FromBody] InvoiceIssuanceDto request)
    {
        var sessionId = GetSessionId();
        if (sessionId == null)
            return Unauthorized(new { message = "Không tìm thấy thông tin phiên làm việc. Vui lòng đăng nhập lại!" });

        var result = await _service.IssueInvoiceAsync(request, sessionId.Value);

        return result.Status == 1 ? Ok(result) : BadRequest(result);
    }

    // POST: api/invoice/replace
    [HttpPost("replace")]
    public async Task<IActionResult> ReplaceInvoice([FromBody] InvoiceReplaceDto dto)
    {
        var sessionId = GetSessionId();
        if (sessionId == null)
            return Unauthorized(new { message = "Không tìm thấy Session ID trong Token!" });

        var result = await _service.ReplaceInvoiceAsync(dto, sessionId.Value);

        return result
            ? Ok(new { message = "Lưu hóa đơn thay thế thành công!" })
            : BadRequest(new { message = "Lưu hóa đơn thất bại!" });
    }

    // POST: api/invoice/adjust
    [HttpPost("adjust")]
    public async Task<IActionResult> AdjustInvoice([FromBody] InvoiceAdjustDto dto)
    {
        var sessionId = GetSessionId();
        if (sessionId == null)
            return Unauthorized(new { message = "Không tìm thấy thông tin phiên làm việc trong Token!" });

        var result = await _service.AdjustInvoiceAsync(dto, sessionId.Value);

        return result
            ? Ok(new { message = "Lưu hóa đơn điều chỉnh thành công!" })
            : BadRequest(new { message = "Lưu hóa đơn điều chỉnh thất bại!" });
    }
}
