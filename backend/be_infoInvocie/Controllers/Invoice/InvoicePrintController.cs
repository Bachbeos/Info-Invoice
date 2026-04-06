using System.Security.Claims;
using be_infoInvoice.Interfaces.Invoice;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace be_infoInvoice.Controllers.Invoice;

[Route("api/invoice")]
[ApiController]
[Authorize]
public class InvoicePrintController : ControllerBase
{
    private readonly IInvoicePrintService _service;

    public InvoicePrintController(IInvoicePrintService service)
    {
        _service = service;
    }

    // GET: api/invoice/print/{transactionId}
    [HttpGet("print/{transactionId}")]
    public async Task<IActionResult> PrintInvoice(string transactionId)
    {
        var str = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                  ?? User.FindFirst("sub")?.Value;

        if (!int.TryParse(str, out int sessionId))
            return Unauthorized();

        try
        {
            byte[] pdfData = await _service.PrintInvoicePdfAsync(transactionId, sessionId);
            return File(pdfData, "application/pdf", $"Invoice_{transactionId}.pdf");
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
