using be_infoInvoice.Database;
using be_infoInvoice.Database.Entities;
using be_infoInvoice.Interfaces.Auth;
using Microsoft.EntityFrameworkCore;

namespace be_infoInvoice.Repositories.Auth;

public class AuthRepository : IAuthRepository
{
    private readonly AppDbContext _context;

    public AuthRepository(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<IEnumerable<Provider>> GetProvidersAsync()
    {
        return await _context.Providers.OrderBy(p => p.Name).ToListAsync();
    }



    public async Task<InvoiceSession?> GetExistingSessionAsync(int providerId, string maDvcs)
    {
        return await _context.InvoiceSessions
            .FirstOrDefaultAsync(s => s.ProviderId == providerId && s.MaDvcs == maDvcs);
    }

    public async Task<InvoiceSession> SaveSessionAsync(InvoiceSession session)
    {
        _context.InvoiceSessions.Add(session);
        await _context.SaveChangesAsync();
        return session;
    }

    public async Task UpdateSessionAsync(InvoiceSession session)
    {
        _context.InvoiceSessions.Update(session);
        await _context.SaveChangesAsync();
    }

    public async Task SaveRefreshTokenAsync(RefreshToken token)
    {
        _context.RefreshTokens.Add(token);
        await _context.SaveChangesAsync();
    }
}
