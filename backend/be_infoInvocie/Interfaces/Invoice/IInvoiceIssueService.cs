using be_infoInvoice.Core.DTOs;

namespace be_infoInvoice.Interfaces.Invoice;

public interface IInvoiceIssueService
{
    Task<ApiResult<InvoiceIssueResponse>> IssueInvoiceAsync(InvoiceIssuanceDto dto, int userId, int taxId);
    Task<bool> ReplaceInvoiceAsync(InvoiceReplaceDto dto, int userId, int taxId);
    Task<bool> AdjustInvoiceAsync(InvoiceAdjustDto dto, int userId, int taxId);
}
