using be_infoInvoice.Database.Entities;
using be_infoInvoice.Core.DTOs;

namespace be_infoInvoice.Interfaces.Invoice;

public interface IInvoiceActionRepository
{
    Task<bool> CreateInvoiceAsync(Database.Entities.Invoice invoice);
    Task<UserAccessConfig?> GetFirstAccessConfigAsync(int userId);
    Task<bool> DeleteAsync(int userId, int taxId, int id);
    Task<bool> UpdateInvoiceAsync(Database.Entities.Invoice invoice);
}
