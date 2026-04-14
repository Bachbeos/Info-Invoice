using be_infoInvoice.Core.DTOs;
using be_infoInvoice.Interfaces.Auth;
using be_infoInvoice.Interfaces.Invoice;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace be_infoInvoice.Controllers.Invoice;

[Route("api/invoice")]
[ApiController]
[Authorize]
public class InvoiceActionController(IInvoiceActionService service, IUserContext userContext) : ControllerBase
{

    [HttpPost("public")]
    public async Task<IActionResult> PublicInvoice([FromBody] InvoicePublicDto request)
    {
        var result = await service.PublicInvoiceAsync(request, userContext.UserId, userContext.TaxId);
        return result.Code == 200 ? Ok(result) : BadRequest(result);
    }

    [HttpPost("replace")]
    public async Task<IActionResult> ReplaceInvoice([FromBody] InvoiceReplaceDto dto)
    {
        var success = await service.ReplaceInvoiceAsync(dto, userContext.UserId, userContext.TaxId);
        return success 
            ? Ok(ApiResult<bool>.Success(true, "Lưu hóa đơn thành công")) 
            : BadRequest(ApiResult<bool>.Failure(400, "Lưu hóa đơn thay thế thất bại"));
    }

    [HttpPost("adjust")]
    public async Task<IActionResult> AdjustInvoice([FromBody] InvoiceAdjustDto dto)
    {
        var success = await service.AdjustInvoiceAsync(dto, userContext.UserId, userContext.TaxId);
        return success
            ? Ok(ApiResult<bool>.Success(true, "Lưu hóa đơn điều chỉnh thành công!"))
            : BadRequest(ApiResult<bool>.Failure(400, "Lưu hóa đơn điều chỉnh thất bại!"));
    }

    [HttpDelete("delete/{id:int}")]
    public async Task<IActionResult> DeleteInvoice(int id)
    {
        var result = await service.DeleteInvoiceAsync(
            id,
            userContext.UserId,
            userContext.TaxId);

        return result.Code == 200 ? Ok(result) : NotFound(result);
    }
}
