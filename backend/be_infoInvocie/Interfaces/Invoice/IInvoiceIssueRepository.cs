using be_infoInvoice.Database.Entities;

namespace be_infoInvoice.Interfaces.Invoice;

public interface IInvoiceIssueRepository
{
    Task<bool> CreateInvoiceAsync(Database.Entities.Invoice invoice);
    Task<InvoiceSession?> GetSessionByIdAsync(int sessionId);
}
