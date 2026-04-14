using be_infoInvoice.Core.DTOs;

namespace be_infoInvoice.Interfaces.Invoice;

public interface IInvoiceActionService
{
    Task<ApiResult<InvoiceIssueResponse>> PublicInvoiceAsync(InvoicePublicDto dto, int userId, int taxId);
    Task<bool> ReplaceInvoiceAsync(InvoiceReplaceDto dto, int userId, int taxId);
    Task<bool> AdjustInvoiceAsync(InvoiceAdjustDto dto, int userId, int taxId);
    Task<ApiResult<bool>> DeleteInvoiceAsync (int userId, int taxId, int id);
}
