using be_infoInvoice.Core.DTOs;
using be_infoInvoice.Interfaces.Auth;
using be_infoInvoice.Interfaces.Invoice;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace be_infoInvoice.Controllers.Invoice;

[Route("api/invoice")]
[ApiController]
[Authorize]
public class InvoiceIssueController(IInvoiceIssueService service, IUserContext userContext) : ControllerBase
{

    // POST: api/invoice/issue
    [HttpPost("issue")]
    public async Task<IActionResult> IssueInvoice([FromBody] InvoiceIssuanceDto request)
    {
        var result = await service.IssueInvoiceAsync(request, userContext.UserId, userContext.TaxId);
        return result.Code == 200 ? Ok(result) : BadRequest(result);
    }

    // POST: api/invoice/replace
    [HttpPost("replace")]
    public async Task<IActionResult> ReplaceInvoice([FromBody] InvoiceReplaceDto dto)
    {
        var success = await service.ReplaceInvoiceAsync(dto, userContext.UserId, userContext.TaxId);
        return success 
            ? Ok(ApiResult<bool>.Success(true, "Lưu hóa đơn thành công")) 
            : BadRequest(ApiResult<bool>.Failure(400, "Lưu hóa đơn thay thế thất bại"));
    }

    // POST: api/invoice/adjust
    [HttpPost("adjust")]
    public async Task<IActionResult> AdjustInvoice([FromBody] InvoiceAdjustDto dto)
    {
        var success = await service.AdjustInvoiceAsync(dto, userContext.UserId, userContext.TaxId);
        return success
            ? Ok(ApiResult<bool>.Success(true, "Lưu hóa đơn điều chỉnh thành công!"))
            : BadRequest(ApiResult<bool>.Failure(400, "Lưu hóa đơn điều chỉnh thất bại!"));
    }

    // GET: api/invoice/list
    [HttpGet("list")]
    public async Task<IActionResult> GetInvoicesList(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null)
    {
        var request = new InvoiceListRequest
        {
            Page = page,
            PageSize = pageSize,
            FromDate = fromDate,
            ToDate = toDate
        };

        var result = await service.GetInvoicesForReplaceAdjustAsync(userContext.UserId, userContext.TaxId, request);
        return result.Code == 200 ? Ok(result) : BadRequest(result);
    }

    // GET: api/invoice/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetInvoiceDetail(int id)
    {
        var result = await service.GetInvoiceDetailAsync(id, userContext.UserId, userContext.TaxId);
        return result.Code == 200 ? Ok(result) : NotFound(result);
    }
}
