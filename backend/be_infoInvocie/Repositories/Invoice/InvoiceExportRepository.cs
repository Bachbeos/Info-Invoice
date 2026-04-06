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

    public async Task<InvoiceSession?> GetSessionByIdAsync(int sessionId)
    {
        return await _context.InvoiceSessions
            .FirstOrDefaultAsync(s => s.Id == sessionId);
    }
}
