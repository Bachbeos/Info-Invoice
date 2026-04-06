using System.Security.Claims;
using be_infoInvoice.Interfaces.Invoice;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace be_infoInvoice.Controllers.Invoice;

[Route("api/invoice")]
[ApiController]
[Authorize]
public class InvoiceExportController : ControllerBase
{
    private readonly IInvoiceExportService _service;

    public InvoiceExportController(IInvoiceExportService service)
    {
        _service = service;
    }

    // GET: api/invoice/export-xml/{transactionId}
    [HttpGet("export-xml/{transactionId}")]
    public async Task<IActionResult> ExportXml(string transactionId)
    {
        var str = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                  ?? User.FindFirst("sub")?.Value;

        if (!int.TryParse(str, out int sessionId))
            return Unauthorized(new { message = "Token không hợp lệ." });

        var result = await _service.ExportInvoiceXmlAsync(transactionId, sessionId);

        return result.Status ? Ok(result) : BadRequest(result);
    }
}
