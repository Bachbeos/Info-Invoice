using be_infoInvoice.Core.DTOs;

namespace be_infoInvoice.Interfaces.Invoice;

public interface IInvoiceIssueService
{
    Task<ApiResult<InvoiceIssueResponse>> IssueInvoiceAsync(InvoiceIssuanceDto dto, int userId, int taxId);
    Task<bool> ReplaceInvoiceAsync(InvoiceReplaceDto dto, int userId, int taxId);
    Task<bool> AdjustInvoiceAsync(InvoiceAdjustDto dto, int userId, int taxId);
    Task<ApiResult<InvoiceListResponse>> GetInvoicesForReplaceAdjustAsync(int userId, int taxId, InvoiceListRequest request);
    Task<ApiResult<InvoiceDetailDto>> GetInvoiceDetailAsync(int invoiceId, int userId, int taxId);

}
