using System.Security.Claims;
using be_infoInvoice.Core.DTOs;
using be_infoInvoice.Interfaces.Invoice;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace be_infoInvoice.Controllers.Invoice;

[Route("api/invoice")]
[ApiController]
[Authorize]
public class InvoiceCheckController : ControllerBase
{
    private readonly IInvoiceCheckService _service;

    public InvoiceCheckController(IInvoiceCheckService service)
    {
        _service = service;
    }

    // POST: api/invoice/check-tax-status
    [HttpPost("check-tax-status")]
    public async Task<IActionResult> CheckTaxStatus([FromBody] TaxCheckRequest request)
    {
        var str = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                  ?? User.FindFirst("sub")?.Value;

        if (!int.TryParse(str, out int sessionId))
            return Unauthorized();

        var result = await _service.CheckTaxStatusAsync(request, sessionId);

        return result.Status ? Ok(result) : BadRequest((object)result);
    }
}
