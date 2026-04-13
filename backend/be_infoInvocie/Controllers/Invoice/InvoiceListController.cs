using be_infoInvoice.Core.DTOs;
using be_infoInvoice.Interfaces.Auth;
using be_infoInvoice.Interfaces.Invoice;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace be_infoInvoice.Controllers.Invoice;

[Route("api/invoice")]
[ApiController]
[Authorize]
public class InvoiceListController(IInvoiceListService listService, IUserContext userContext) : ControllerBase
{
    [HttpGet("list")]
    public async Task<IActionResult> GetInvoices([FromQuery] InvoiceListRequest request)
    {
        var result = await listService.GetInvoicesAsync(
            userContext.UserId,
            userContext.TaxId,
            request);

        return result.Code == 200 ? Ok(result) : BadRequest(result);
    }

    [HttpGet("get/{id:int}")]
    public async Task<IActionResult> GetDetail(int id)
    {
        var result = await listService.GetInvoiceDetailAsync(
            id,
            userContext.UserId,
            userContext.TaxId);

        return result.Code == 200 ? Ok(result) : NotFound(result);
    }
}