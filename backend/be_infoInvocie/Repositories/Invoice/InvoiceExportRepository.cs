using be_infoInvoice.Database;
using be_infoInvoice.Database.Entities;
using be_infoInvoice.Interfaces.Invoice;
using Microsoft.EntityFrameworkCore;

namespace be_infoInvoice.Repositories.Invoice;

public class InvoiceExportRepository : IInvoiceExportRepository
{
    private readonly AppDbContext _context;

    public InvoiceExportRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<UserAccessConfig?> GetFirstAccessConfigAsync(int userId)
    {
        return await _context.UserAccessConfigs
            .FirstOrDefaultAsync(s => s.UserId == userId);
    }
}
