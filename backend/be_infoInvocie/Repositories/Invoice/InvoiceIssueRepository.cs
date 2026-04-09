using be_infoInvoice.Database;
using be_infoInvoice.Database.Entities;
using be_infoInvoice.Interfaces.Invoice;
using Microsoft.EntityFrameworkCore;

namespace be_infoInvoice.Repositories.Invoice;

public class InvoiceIssueRepository : IInvoiceIssueRepository
{
    private readonly AppDbContext _context;

    public InvoiceIssueRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> CreateInvoiceAsync(Database.Entities.Invoice invoice)
    {
        _context.Invoices.Add(invoice);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<UserAccessConfig?> GetFirstAccessConfigAsync(int userId)
    {
        return await _context.UserAccessConfigs
            .FirstOrDefaultAsync(c => c.UserId == userId);
    }
}
