using be_infoInvoice.Database.Entities;

namespace be_infoInvoice.Interfaces;

public interface ITctRepository
{
    Task<TctAccount?> GetAccountByTaxCodeAsync(string taxCode);
    Task<TctAccount> SaveAccountAsync(TctAccount account);
    Task<TctSession> SaveSessionAsync(int accountId, string token);
    Task<TctSession?> GetValidSessionAsync(string token);
    
    Task<bool> BulkUpsertInvoicesAsync(List<TctInvoice> invoices);
    Task<TctInvoice?> GetInvoiceByTctIdAsync(string tctId);
    Task<bool> UpdateInvoiceDetailAsync(string tctId, string detailJson);
    Task<bool> UpdateInvoiceXmlAsync(string tctId, string xmlData);
}
