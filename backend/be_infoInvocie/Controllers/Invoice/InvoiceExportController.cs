using System.Security.Claims;
using be_infoInvoice.Interfaces.Auth;
using be_infoInvoice.Interfaces.Invoice;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace be_infoInvoice.Controllers.Invoice;

[Route("api/invoice")]
[ApiController]
[Authorize]
public class InvoiceExportController(IInvoiceExportService service, IUserContext userContext) : ControllerBase
{
    // GET: api/invoice/export-xml/{transactionId}
    [HttpGet("export-xml/{transactionId}")]
    public async Task<IActionResult> ExportXml(string transactionId)
    {
        if (userContext.UserId <= 0)
            return Unauthorized(new { message = "Token không hợp lệ." });

        var result = await service.ExportInvoiceXmlAsync(transactionId, userContext.UserId, userContext.TaxId);

        return result.Status ? Ok(result) : BadRequest(result);
    }
}
