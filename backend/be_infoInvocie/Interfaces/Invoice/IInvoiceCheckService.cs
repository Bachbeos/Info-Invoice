using be_infoInvoice.Core.DTOs;

namespace be_infoInvoice.Interfaces.Invoice;

public interface IInvoiceCheckService
{
    Task<TaxCheckResponse> CheckTaxStatusAsync(TaxCheckRequest request, int sessionId);
}
