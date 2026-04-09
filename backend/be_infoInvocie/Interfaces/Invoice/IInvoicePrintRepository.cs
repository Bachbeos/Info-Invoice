using be_infoInvoice.Database.Entities;

namespace be_infoInvoice.Interfaces.Invoice;

public interface IInvoicePrintRepository
{
    Task<UserAccessConfig?> GetFirstAccessConfigAsync(int userId);
}
