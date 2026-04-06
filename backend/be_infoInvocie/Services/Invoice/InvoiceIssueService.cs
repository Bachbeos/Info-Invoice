using be_infoInvoice.Core.DTOs;
using be_infoInvoice.Database.Entities;
using be_infoInvoice.Interfaces.Invoice;

namespace be_infoInvoice.Services.Invoice;

public class InvoiceIssueService : IInvoiceIssueService
{
    private readonly IInvoiceIssueRepository _repository;

    public InvoiceIssueService(IInvoiceIssueRepository repository)
    {
        _repository = repository;
    }

    /// <summary>
    /// PHÁT HÀNH MỚI: Lưu hóa đơn gốc (InvoiceType = 1)
    /// </summary>
    public async Task<InvoiceIssueResponse> IssueInvoiceAsync(InvoiceIssuanceDto dto, int sessionId)
    {
        var invoice = MapBaseInvoice(dto, sessionId);
        invoice.InvoiceType = 1; // Hóa đơn gốc

        var saved = await _repository.CreateInvoiceAsync(invoice);

        if (!saved)
        {
            return new InvoiceIssueResponse
            {
                Code = 500,
                Status = 0,
                Message = "Lưu hóa đơn thất bại. Vui lòng kiểm tra lại dữ liệu.",
                Data = null
            };
        }

        // TODO: Gọi API nhà cung cấp (EasyInvoice/SInvoice...) để lấy invoiceNo, invDate, macqt thật
        return new InvoiceIssueResponse
        {
            Code = 200,
            Status = 1,
            Message = "Lưu hóa đơn vào hệ thống thành công!",
            Data = new InvoiceIssueData
            {
                InvoiceNo     = string.Empty,
                InvDate       = DateTime.Now.ToString("yyyy-MM-dd"),
                TransactionId = dto.TransactionId,
                Macqt         = string.Empty
            }
        };
    }

    /// <summary>
    /// THAY THẾ: Lưu hóa đơn thay thế (InvoiceType = 2)
    /// </summary>
    public async Task<bool> ReplaceInvoiceAsync(InvoiceReplaceDto dto, int sessionId)
    {
        var invoice = MapBaseInvoice(dto, sessionId);
        invoice.InvoiceType = 2;
        invoice.TransactionIdOld = dto.TransactionIdOld;
        invoice.NoteDesc = dto.Note;

        return await _repository.CreateInvoiceAsync(invoice);
    }

    /// <summary>
    /// ĐIỀU CHỈNH: Lưu hóa đơn điều chỉnh (InvoiceType = 3)
    /// </summary>
    public async Task<bool> AdjustInvoiceAsync(InvoiceAdjustDto dto, int sessionId)
    {
        var invoice = MapBaseInvoice(dto, sessionId);
        invoice.InvoiceType = 3;
        invoice.TransactionIdOld = dto.TransactionIdOld;
        invoice.NoteDesc = dto.Note;

        return await _repository.CreateInvoiceAsync(invoice);
    }

    /// <summary>
    /// PRIVATE HELPER: Map dữ liệu từ DTO sang Entity (dùng chung cho cả 3 loại hóa đơn)
    /// </summary>
    private static Database.Entities.Invoice MapBaseInvoice(InvoiceIssuanceDto dto, int sessionId)
    {
        return new Database.Entities.Invoice
        {
            SessionId       = sessionId,
            TransactionId   = dto.TransactionId,
            InvRef          = dto.InvRef,
            PoNo            = dto.PoNo,
            InvSubTotal     = dto.InvSubTotal,
            InvVatRate      = dto.InvVatRate,
            InvDiscAmount   = dto.InvDiscAmount,
            InvVatAmount    = dto.InvVatAmount,
            InvTotalAmount  = dto.InvTotalAmount,
            PaidTp          = dto.PaidTp,
            Note            = dto.Note,
            ExchCd          = dto.ExchCd,
            ExchRt          = dto.ExchRt,
            BankAccount     = dto.BankAccount,
            BankName        = dto.BankName,
            Status          = false,
            CreatedAt       = DateTime.Now,

            Customer = new InvoiceCustomer
            {
                CustCd          = dto.Customer.CustCd,
                CustNm          = dto.Customer.CustNm,
                CustCompany     = dto.Customer.CustCompany,
                TaxCode         = dto.Customer.TaxCode,
                CustCity        = dto.Customer.CustCity,
                CustDistrict    = dto.Customer.CustDistrictName,
                CustAddrs       = dto.Customer.CustAddrs,
                CustPhone       = dto.Customer.CustPhone,
                CustBankAccount = dto.Customer.CustBankAccount,
                CustBankName    = dto.Customer.CustBankName,
                Email           = dto.Customer.Email,
                EmailCc         = dto.Customer.EmailCC
            },

            Items = dto.Products.Select(p => new InvoiceItem
            {
                ItmCd   = p.ItmCd,
                ItmName = p.ItmName,
                ItmKnd  = p.ItmKnd,
                UnitNm  = p.UnitNm,
                Qty     = p.Qty,
                Unprc   = p.Unprc,
                Amt     = p.Amt,
                DiscRate = p.DiscRate,
                DiscAmt = p.DiscAmt,
                VatRt   = p.VatRt,
                VatAmt  = p.VatAmt,
                TotalAmt = p.TotalAmt
            }).ToList()
        };
    }
}
