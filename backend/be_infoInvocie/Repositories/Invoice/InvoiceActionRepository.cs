using be_infoInvoice.Database;
using be_infoInvoice.Core.DTOs;
using be_infoInvoice.Database.Entities;
using be_infoInvoice.Interfaces.Invoice;
using Microsoft.EntityFrameworkCore;

namespace be_infoInvoice.Repositories.Invoice;

public class InvoiceActionRepository : IInvoiceActionRepository
{
    private readonly AppDbContext _context;

    public InvoiceActionRepository(AppDbContext context)
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

    public async Task<(List<InvoiceListItemDto> items, int total)> GetInvoicesByUserAsync(int userId, int taxId, int page, int pageSize, DateTime? fromDate, DateTime? toDate)
    {
        var query = _context.Invoices
            .Where(i => i.UserId == userId && i.TaxId == taxId && i.InvoiceType == 1);

        if (fromDate.HasValue)
            query = query.Where(i => i.CreatedDate >= fromDate.Value);

        if (toDate.HasValue)
            query = query.Where(i => i.CreatedDate <= toDate.Value);

        var total = await query.CountAsync();

        var items = await query
            .OrderByDescending(i => i.CreatedDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(i => new InvoiceListItemDto
            {
                Id = i.Id,
                TransactionId = i.TransactionId ?? string.Empty,
                InvRef = i.InvRef ?? string.Empty,
                InvTotalAmount = i.InvTotalAmount,
                ExchCd = i.ExchCd ?? "VND",
                //CreatedAt = i.CreatedAt,
                InvoiceType = i.InvoiceType,
            })
            .ToListAsync();

        return (items, total);
    }

    public async Task<bool> UpdateInvoiceAsync(Database.Entities.Invoice invoice)
    {
        var existingInvoice = await _context.Invoices
            .Include(i => i.Customer)
            .Include(i => i.Items)
            .FirstOrDefaultAsync(i => i.TransactionId == invoice.TransactionId && i.UserId == invoice.UserId);

        if (existingInvoice == null) return false;
        
        invoice.Id = existingInvoice.Id;
        _context.Entry(existingInvoice).CurrentValues.SetValues(invoice);

        if (existingInvoice.Customer != null && invoice.Customer != null)
        {
            invoice.Customer.Id = existingInvoice.Customer.Id;
            invoice.Customer.InvoiceId = existingInvoice.Id;
            _context.Entry(existingInvoice.Customer).CurrentValues.SetValues(invoice.Customer);
        }
        else if (existingInvoice.Customer == null && invoice.Customer != null)
        {
            invoice.Customer.InvoiceId = existingInvoice.Id;
            existingInvoice.Customer = invoice.Customer;
        }

        _context.InvoiceItems.RemoveRange(existingInvoice.Items);
        foreach (var item in invoice.Items)
        {
            item.InvoiceId = existingInvoice.Id;
        }
        existingInvoice.Items = invoice.Items;

        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<Database.Entities.Invoice?> GetInvoiceByIdAsync(int invoiceId, int userId, int taxId)
    {
        return await _context.Invoices
            .Where(i => i.Id == invoiceId && i.UserId == userId && i.TaxId == taxId)
            .Select(i => new Database.Entities.Invoice
            {
                Id = i.Id,
                UserId = i.UserId,
                TaxId = i.TaxId,
                TransactionId = i.TransactionId ?? string.Empty,
                InvRef = i.InvRef ?? string.Empty,
                PoNo = i.PoNo,
                InvSubTotal = i.InvSubTotal,
                InvVatRate = i.InvVatRate,
                InvDiscAmount = i.InvDiscAmount,
                InvVatAmount = i.InvVatAmount,
                InvTotalAmount = i.InvTotalAmount,
                PaidTp = i.PaidTp ?? "CK",
                Note = i.Note,
                HdNo = i.HdNo,
                CreatedDate = i.CreatedDate,
                ClsfNo = i.ClsfNo ?? string.Empty,
                SpcfNo = i.SpcfNo ?? string.Empty,
                TemplateCode = i.TemplateCode ?? string.Empty,
                ExchCd = i.ExchCd,
                ExchRt = i.ExchRt,
                BankAccount = i.BankAccount,
                BankName = i.BankName,
                CreatedAt = i.CreatedAt,
                InvoiceType = i.InvoiceType,
                TransactionIdOld = i.TransactionIdOld,
                NoteDesc = i.NoteDesc,
                Customer = i.Customer == null
                    ? null
                    : new InvoiceCustomer
                    {
                        Id = i.Customer.Id,
                        InvoiceId = i.Customer.InvoiceId,
                        CustCd = i.Customer.CustCd,
                        CustNm = i.Customer.CustNm ?? string.Empty,
                        CustCompany = i.Customer.CustCompany,
                        TaxCode = i.Customer.TaxCode,
                        CustCity = i.Customer.CustCity,
                        CustDistrict = i.Customer.CustDistrict,
                        CustAddrs = i.Customer.CustAddrs,
                        CustPhone = i.Customer.CustPhone,
                        CustBankAccount = i.Customer.CustBankAccount,
                        CustBankName = i.Customer.CustBankName,
                        Email = i.Customer.Email,
                        EmailCc = i.Customer.EmailCc
                    },
                Items = i.Items.Select(item => new InvoiceItem
                {
                    Id = item.Id,
                    InvoiceId = item.InvoiceId,
                    ItmCd = item.ItmCd,
                    ItmName = item.ItmName ?? string.Empty,
                    ItmKnd = item.ItmKnd,
                    UnitNm = item.UnitNm,
                    Qty = item.Qty,
                    Unprc = item.Unprc,
                    Amt = item.Amt,
                    DiscRate = item.DiscRate,
                    DiscAmt = item.DiscAmt,
                    VatRt = item.VatRt ?? string.Empty,
                    VatAmt = item.VatAmt,
                    TotalAmt = item.TotalAmt
                }).ToList()
            })
            .FirstOrDefaultAsync();
    }

    public async Task<bool> DeleteAsync(int id, int taxId, int userId)
    {
        var invoice = await _context.Invoices
            .FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId && i.TaxId == taxId);

        if (invoice == null) return false;

        _context.Invoices.Remove(invoice);

        await _context.SaveChangesAsync();
        return true;
    }
}
