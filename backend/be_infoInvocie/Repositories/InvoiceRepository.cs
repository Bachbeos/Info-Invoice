using be_infoInvoice.Database;
using be_infoInvoice.Database.Entities;
using be_infoInvoice.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace be_infoInvoice.Repositories;

public class InvoiceRepository : IInvoiceRepository
{
    private readonly AppDbContext _context;

    public InvoiceRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Provider>> GetProvidersAsync()
    {
        return await _context.Providers.OrderBy(p => p.Name).ToListAsync();
    }

    public async Task<InvoiceSession> SaveSessionAsync(InvoiceSession session)
    {
        _context.InvoiceSessions.Add(session);
        await _context.SaveChangesAsync();
        return session; // Trả về để lấy được ID tự tăng cho bước lưu Token
    }

    public async Task SaveRefreshTokenAsync(RefreshToken token)
    {
        _context.RefreshTokens.Add(token);
        await _context.SaveChangesAsync();
    }
}