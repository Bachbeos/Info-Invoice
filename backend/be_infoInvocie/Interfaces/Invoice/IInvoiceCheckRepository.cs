using be_infoInvoice.Database.Entities;

namespace be_infoInvoice.Interfaces.Invoice;

public interface IInvoiceCheckRepository
{
    Task<bool> SaveTaxCheckHistoryAsync(List<TaxCheckHistory> historyList);
}
