using be_infoInvoice.Core.DTOs;
using be_infoInvoice.Database.Entities;

namespace be_infoInvoice.Interfaces;

public interface IInvoiceService
{
    Task<IEnumerable<Provider>> GetAvailableProvidersAsync();
    
    // Handle Login and return success or fail
    Task<(bool IsSuccess, int SessionId)> AuthenticateAndSaveSessionAsync(LoginRequest request);
    Task<bool> IssueInvoiceAsync(InvoiceIssuanceDto dto, int sessionId);
    
    Task<bool> ReplaceInvoiceAsync(InvoiceReplaceDto dto, int sessionId);
    Task<bool> AdjustInvoiceAsync(InvoiceAdjustDto dto, int sessionId);
    Task<InvoiceExportResponse> ExportInvoiceXmlAsync(string transactionId, int sessionId);
}