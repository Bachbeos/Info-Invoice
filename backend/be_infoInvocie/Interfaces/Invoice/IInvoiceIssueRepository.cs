using be_infoInvoice.Database.Entities;
using be_infoInvoice.Core.DTOs;

namespace be_infoInvoice.Interfaces.Invoice;

public interface IInvoiceIssueRepository
{
    Task<bool> CreateInvoiceAsync(Database.Entities.Invoice invoice);
    Task<UserAccessConfig?> GetFirstAccessConfigAsync(int userId);
}
