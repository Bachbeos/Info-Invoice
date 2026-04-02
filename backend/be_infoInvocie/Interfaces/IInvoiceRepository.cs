using be_infoInvoice.Database.Entities;

namespace be_infoInvoice.Interfaces;

public interface IInvoiceRepository
{
    // Get list Provider
    Task<IEnumerable<Provider>> GetProvidersAsync();
    //Save the login session and return the id of newly created session
    Task<InvoiceSession> SaveSessionAsync(InvoiceSession session);
    //Save refresh token linked to session
    Task SaveRefreshTokenAsync(RefreshToken token);
    
    Task<InvoiceSession?> GetExistingSessionAsync(int providerId, string maDvcs);
    Task UpdateSessionAsync(InvoiceSession session);
    Task<bool> CreateInvoiceAsync(Invoice invoice);
    
    Task<InvoiceSession?> GetSessionByIdAsync(int sessionId);
    Task<bool> SaveTaxCheckHistoryAsync(List<TaxCheckHistory> historyList);
    
    
}