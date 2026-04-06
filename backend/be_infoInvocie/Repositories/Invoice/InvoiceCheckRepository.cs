using be_infoInvoice.Database;
using be_infoInvoice.Database.Entities;
using be_infoInvoice.Interfaces.Invoice;

namespace be_infoInvoice.Repositories.Invoice;

public class InvoiceCheckRepository : IInvoiceCheckRepository
{
    private readonly AppDbContext _context;

    public InvoiceCheckRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> SaveTaxCheckHistoryAsync(List<TaxCheckHistory> historyList)
    {
        await _context.TaxCheckHistories.AddRangeAsync(historyList);
        return await _context.SaveChangesAsync() > 0;
    }
}
