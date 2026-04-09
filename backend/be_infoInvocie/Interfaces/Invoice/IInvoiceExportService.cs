using be_infoInvoice.Core.DTOs;

namespace be_infoInvoice.Interfaces.Invoice;

public interface IInvoiceExportService
{
    Task<InvoiceExportResponse> ExportInvoiceXmlAsync(string transactionId, int userId, int taxId);
}
