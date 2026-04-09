using System.Security.Claims;
using be_infoInvoice.Core.DTOs;
using be_infoInvoice.Interfaces.Auth;
using be_infoInvoice.Interfaces.Invoice;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace be_infoInvoice.Controllers.Invoice;

[Route("api/invoice")]
[ApiController]
[Authorize]
public class InvoiceCheckController(IInvoiceCheckService service, IUserContext userContext) : ControllerBase
{
    // POST: api/invoice/check-tax-status
    [HttpPost("check-tax-status")]
    public async Task<IActionResult> CheckTaxStatus([FromBody] TaxCheckRequest request)
    {
        if (userContext.UserId <= 0)
            return Unauthorized();

        var result = await service.CheckTaxStatusAsync(request, userContext.UserId, userContext.TaxId);

        return result.Status ? Ok(result) : BadRequest((object)result);
    }
}
