using be_infoInvoice.Core.DTOs;
using be_infoInvoice.Database;
using be_infoInvoice.Interfaces.Invoice;
using Microsoft.EntityFrameworkCore;

namespace be_infoInvoice.Repositories.Invoice
{
    public class InvoiceListRepository: IInvoiceListRepository
    {
        private readonly AppDbContext _context;

        public InvoiceListRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<(List<InvoiceListItemDto> Items, int TotalCount)> GetInvoicesAsync(int userId, int taxId, InvoiceListRequest request)
        {
            var query = _context.Invoices
                 .AsNoTracking()
                 .Where(i => i.UserId == userId && i.TaxId == taxId);

            if (request.FromDate.HasValue)
                query = query.Where(i => i.CreatedAt >= request.FromDate.Value);

            if (request.ToDate.HasValue)
                query = query.Where(i => i.CreatedAt <= request.ToDate.Value);

            var total = await query.CountAsync();

            var items = await query
                .OrderByDescending(i => i.CreatedAt)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(i => new InvoiceListItemDto
                {
                    Id = i.Id,
                    TransactionId = i.TransactionId ?? string.Empty,
                    InvRef = i.InvRef ?? string.Empty,
                    InvTotalAmount = i.InvTotalAmount,
                    ExchCd = i.ExchCd ?? "VND",
                    CreatedAt = i.CreatedAt,
                    InvoiceType = i.InvoiceType,
                })
                .ToListAsync();
            return (items, total);
        }

        public async Task<Database.Entities.Invoice?> GetByIdAsync(int id, int userId, int taxId)
        {
            return await _context.Invoices
            .AsNoTracking()
            .Include(i => i.Customer)
            .Include(i => i.Items)
            .FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId && i.TaxId == taxId);
        }
    }
}
