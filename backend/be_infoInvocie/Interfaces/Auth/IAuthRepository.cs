using be_infoInvoice.Database.Entities;

namespace be_infoInvoice.Interfaces.Auth;

public interface IAuthRepository
{
    Task<IEnumerable<Provider>> GetProvidersAsync();
    Task<InvoiceSession?> GetExistingSessionAsync(int providerId, string maDvcs);
    Task<InvoiceSession> SaveSessionAsync(InvoiceSession session);
    Task UpdateSessionAsync(InvoiceSession session);
    Task SaveRefreshTokenAsync(RefreshToken token);
}
