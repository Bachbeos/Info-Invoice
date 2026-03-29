using be_infoInvoice.Database.Entities;

namespace be_infoInvoice.Interfaces;

public interface IInvoiceRepository
{
    // Lay danh sach nha cung cap
    Task<IEnumerable<Provider>> GetProvidersAsync();
    //Luu phien dang nhap va tra ve ID cua session vua tao
    Task<InvoiceSession> SaveSessionAsync(InvoiceSession session);
    //Luu refresh token lien ket voi session
    Task SaveRefreshTokenAsync(RefreshToken token);
}