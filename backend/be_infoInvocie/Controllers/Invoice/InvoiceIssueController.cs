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
        var result = await service.IssueInvoiceAsync(request, userContext.SessionId);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    // POST: api/invoice/replace
    [HttpPost("replace")]
    public async Task<IActionResult> ReplaceInvoice([FromBody] InvoiceReplaceDto dto)
    {
        var success = await service.ReplaceInvoiceAsync(dto, userContext.SessionId);
        return success 
            ? Ok(ApiResult<bool>.Success(true, "Lưu hóa đơn thành công")) 
            : BadRequest(ApiResult<bool>.Failure(400, "Lưu hóa đơn thay thế thất bại"));
    }

    // POST: api/invoice/adjust
    [HttpPost("adjust")]
    public async Task<IActionResult> AdjustInvoice([FromBody] InvoiceAdjustDto dto)
    {
        var success = await service.AdjustInvoiceAsync(dto, userContext.SessionId);
        return success
            ? Ok(ApiResult<bool>.Success(true, "Lưu hóa đơn điều chỉnh thành công!"))
            : BadRequest(ApiResult<bool>.Failure(400, "Lưu hóa đơn điều chỉnh thất bại!"));
    }
}
