using System.Security.Claims;
using be_infoInvoice.Interfaces.Auth;
using be_infoInvoice.Interfaces.Invoice;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace be_infoInvoice.Controllers.Invoice;

[Route("api/invoice")]
[ApiController]
[Authorize]
public class InvoicePrintController(IInvoicePrintService service, IUserContext userContext) : ControllerBase
{
    // GET: api/invoice/print/{transactionId}
    [HttpGet("print/{transactionId}")]
    public async Task<IActionResult> PrintInvoice(string transactionId)
    {
        if (userContext.UserId <= 0)
            return Unauthorized();

        try
        {
            byte[] pdfData = await service.PrintInvoicePdfAsync(transactionId, userContext.UserId, userContext.TaxId);
            return File(pdfData, "application/pdf", $"Invoice_{transactionId}.pdf");
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
