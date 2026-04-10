using be_infoInvoice.Database.Entities;
using be_infoInvoice.Core.DTOs;

namespace be_infoInvoice.Interfaces.Invoice;

public interface IInvoiceIssueRepository
{
    Task<bool> CreateInvoiceAsync(Database.Entities.Invoice invoice);
    Task<UserAccessConfig?> GetFirstAccessConfigAsync(int userId);
    Task<(List<InvoiceListItemDto> items, int total)> GetInvoicesByUserAsync(int userId, int taxId, int page, int pageSize, DateTime? fromDate, DateTime? toDate);
    Task<Database.Entities.Invoice?> GetInvoiceByIdAsync(int invoiceId, int userId, int taxId);
}
