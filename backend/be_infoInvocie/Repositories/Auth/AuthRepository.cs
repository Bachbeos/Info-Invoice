using be_infoInvoice.Database;
using be_infoInvoice.Database.Entities;
using be_infoInvoice.Interfaces.Auth;
using Microsoft.EntityFrameworkCore;

namespace be_infoInvoice.Repositories.Auth;

public class AuthRepository : IAuthRepository
{
    //DI 
    private readonly AppDbContext _context;

    public AuthRepository(AppDbContext context)
    {
        _context = context;
    }
    
    //Get list provider, sort by name: SELECT * FROM Providers ORDER BY Name
    public async Task<IEnumerable<Provider>> GetProvidersAsync()
    {
        return await _context.Providers.OrderBy(p => p.Name).ToListAsync();
    }

    //Find an existing session: SELECT TOP 1 * FROM InvoiceSessions WHERE ProviderId = ... AND MaDvcs = ...
    public async Task<InvoiceSession?> GetExistingSessionAsync(int providerId, string maDvcs)
    {
        return await _context.InvoiceSessions
            .FirstOrDefaultAsync(s => s.ProviderId == providerId && s.MaDvcs == maDvcs);
    }

    //Save new session: 
    public async Task<InvoiceSession> SaveSessionAsync(InvoiceSession session)
    {
        _context.InvoiceSessions.Add(session); //add to context, not yet added db
        await _context.SaveChangesAsync(); // push to DB
        return session; // return object ( already have ID )
    }

    //Update entity, save to DB
    public async Task UpdateSessionAsync(InvoiceSession session)
    {
        _context.InvoiceSessions.Update(session);
        await _context.SaveChangesAsync();
    }

    //Add token to db, save
    public async Task SaveRefreshTokenAsync(RefreshToken token)
    {
        _context.RefreshTokens.Add(token);
        await _context.SaveChangesAsync();
    }
}
