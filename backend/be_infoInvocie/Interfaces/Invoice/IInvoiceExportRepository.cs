using be_infoInvoice.Database.Entities;

namespace be_infoInvoice.Interfaces.Invoice;

public interface IInvoiceExportRepository
{
    Task<UserAccessConfig?> GetFirstAccessConfigAsync(int userId);
}
