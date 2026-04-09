using be_infoInvoice.Core.DTOs;

namespace be_infoInvoice.Interfaces.Invoice;

public interface IInvoiceIssueService
{
    Task<ApiResult<InvoiceIssueResponse>> IssueInvoiceAsync(InvoiceIssuanceDto dto, int sessionId);
    Task<bool> ReplaceInvoiceAsync(InvoiceReplaceDto dto, int sessionId);
    Task<bool> AdjustInvoiceAsync(InvoiceAdjustDto dto, int sessionId);
}
