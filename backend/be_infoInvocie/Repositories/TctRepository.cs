using be_infoInvoice.Database;
using be_infoInvoice.Database.Entities;
using be_infoInvoice.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace be_infoInvoice.Repositories;

public class TctRepository : ITctRepository
{
    private readonly AppDbContext _context;

    public TctRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<TctAccount?> GetAccountByTaxCodeAsync(string taxCode)
    {
        return await _context.TctAccounts.FirstOrDefaultAsync(a => a.TaxCode == taxCode);
    }

    public async Task<TctAccount> SaveAccountAsync(TctAccount account)
    {
        _context.TctAccounts.Add(account);
        await _context.SaveChangesAsync();
        return account;
    }

    public async Task<TctSession> SaveSessionAsync(int accountId, string token)
    {
        var session = new TctSession
        {
            AccountId = accountId,
            SessionToken = token,
            CreatedAt = DateTime.Now,
            ExpiresAt = DateTime.Now.AddHours(24)
        };
        _context.TctSessions.Add(session);
        await _context.SaveChangesAsync();
        return session;
    }

    public async Task<TctSession?> GetValidSessionAsync(string token)
    {
        return await _context.TctSessions
            .FirstOrDefaultAsync(s => s.SessionToken == token && s.ExpiresAt > DateTime.Now);
    }

    public async Task<bool> BulkUpsertInvoicesAsync(List<TctInvoice> invoices)
    {
        foreach (var inv in invoices)
        {
            var existing = await _context.TctInvoices.FirstOrDefaultAsync(i => i.TctId == inv.TctId);
            if (existing == null)
            {
                _context.TctInvoices.Add(inv);
            }
            else
            {
                // Update basic info from sync list
                existing.Tthai = inv.Tthai;
                existing.Ttxly = inv.Ttxly;
                existing.Mhdon = inv.Mhdon;
                existing.SyncCreatedAt = DateTime.Now;
            }
        }
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<TctInvoice?> GetInvoiceByTctIdAsync(string tctId)
    {
        return await _context.TctInvoices.FirstOrDefaultAsync(i => i.TctId == tctId);
    }

    public async Task<bool> UpdateInvoiceDetailAsync(string tctId, string detailJson)
    {
        var inv = await GetInvoiceByTctIdAsync(tctId);
        if (inv != null)
        {
            inv.DetailJson = detailJson;
            return await _context.SaveChangesAsync() > 0;
        }
        return false;
    }

    public async Task<bool> UpdateInvoiceXmlAsync(string tctId, string xmlData)
    {
        var inv = await GetInvoiceByTctIdAsync(tctId);
        if (inv != null)
        {
            inv.XmlData = xmlData;
            return await _context.SaveChangesAsync() > 0;
        }
        return false;
    }
}
