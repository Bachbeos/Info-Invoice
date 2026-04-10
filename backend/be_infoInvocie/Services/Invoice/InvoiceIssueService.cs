using be_infoInvoice.Core.DTOs;
using be_infoInvoice.Database.Entities;
using be_infoInvoice.Interfaces.Invoice;
using be_infoInvoice.Interfaces.Invoice.Validators;

namespace be_infoInvoice.Services.Invoice;

public enum InvoiceType { Public = 1, Replace = 2, Adjust = 3 }

public class InvoiceIssueService : IInvoiceIssueService
{
    private readonly IInvoiceIssueRepository _repository;
    private readonly IInvoiceValidator _validator;

    public InvoiceIssueService(IInvoiceIssueRepository repository, IInvoiceValidator validator)
    {
        _repository = repository;
        _validator = validator;
    }

    public async Task<ApiResult<InvoiceIssueResponse>> IssueInvoiceAsync(InvoiceIssuanceDto dto, int userId, int taxId)
    {
        var (isValid, validationMessage) = _validator.ValidateInvoice(dto);
        if (!isValid)
        {
            return ApiResult<InvoiceIssueResponse>.Failure(400, validationMessage);
        }

        if (taxId <= 0)
        {
            return ApiResult<InvoiceIssueResponse>.Failure(401, "Vui lòng đăng nhập lại để xác thực mã số thuế.");
        }

        var invoice = await SaveInvoiceToDbAsync(dto, userId, taxId, InvoiceType.Public);
        if (invoice == null)
        {
            return ApiResult<InvoiceIssueResponse>.Failure(500, "Lỗi hệ thống: Không thể lưu dữ liệu hóa đơn.");
        }

        var responseData = new InvoiceIssueResponse
        {
            InvoiceNo = string.Empty,
            InvDate = DateTime.Now.ToString("yyyy-MM-dd"),
            TransactionId = dto.TransactionId,
            Macqt = string.Empty
        };

        return ApiResult<InvoiceIssueResponse>.Success(responseData, "Phát hành hóa đơn thành công!");
    }

    public async Task<bool> ReplaceInvoiceAsync(InvoiceReplaceDto dto, int userId, int taxId)
    {
        if (taxId <= 0) return false;
        var invoice = await SaveInvoiceToDbAsync(dto, userId, taxId, InvoiceType.Replace, dto.TransactionIdOld, dto.Note);
        return invoice != null;
    }

    public async Task<bool> AdjustInvoiceAsync(InvoiceAdjustDto dto, int userId, int taxId)
    {
        if (taxId <= 0) return false;
        var invoice = await SaveInvoiceToDbAsync(dto, userId, taxId, InvoiceType.Adjust, dto.TransactionIdOld, dto.Note);
        return invoice != null;
    }

    //public async Task<Database.Entities.Invoice?> SaveInvoiceToDbAsync(InvoiceIssuanceDto dto, int userId, int taxId, InvoiceType type, string? oldId = null, string? noteDesc = null)
    //{
    //    var invoice = MapBaseInvoice(dto, userId, taxId);
    //    invoice.InvoiceType = (sbyte)type;
    //    invoice.TransactionIdOld = oldId;
    //    invoice.NoteDesc = noteDesc;

    //    var success = await _repository.CreateInvoiceAsync(invoice);
    //    return success ? invoice : null;
    //}

    public async Task<ApiResult<InvoiceListResponse>> GetInvoicesForReplaceAdjustAsync(int userId, int taxId, InvoiceListRequest request)
    {
        if (userId <= 0 || taxId <= 0)
        {
            return ApiResult<InvoiceListResponse>.Failure(401, "Thông tin xác thực không hợp lệ");
        }

        var (invoices, total) = await _repository.GetInvoicesByUserAsync(userId, taxId, request.Page, request.PageSize, request.FromDate, request.ToDate);

        var totalPages = (int)Math.Ceiling((double)total / request.PageSize);

        var response = new InvoiceListResponse
        {
            Total = total,
            Page = request.Page,
            PageSize = request.PageSize,
            TotalPages = totalPages,
            Items = invoices
        };

        return ApiResult<InvoiceListResponse>.Success(response, "Lấy danh sách hóa đơn thành công");
    }

    public async Task<ApiResult<InvoiceDetailDto>> GetInvoiceDetailAsync(int invoiceId, int userId, int taxId)
    {
        if (userId <= 0 || taxId <= 0)
        {
            return ApiResult<InvoiceDetailDto>.Failure(401, "Thông tin xác thực không hợp lệ");
        }

        var invoice = await _repository.GetInvoiceByIdAsync(invoiceId, userId, taxId);
        if (invoice == null)
        {
            return ApiResult<InvoiceDetailDto>.Failure(404, "Không tìm thấy hóa đơn");
        }

        var customerDto = invoice.Customer != null ? new InvoiceCustomerDto
        {
            Id = invoice.Customer.Id,
            CustCd = invoice.Customer.CustCd,
            CustNm = invoice.Customer.CustNm,
            CustCompany = invoice.Customer.CustCompany,
            TaxCode = invoice.Customer.TaxCode,
            CustCity = invoice.Customer.CustCity,
            CustDistrict = invoice.Customer.CustDistrict,
            CustAddrs = invoice.Customer.CustAddrs,
            CustPhone = invoice.Customer.CustPhone,
            CustBankAccount = invoice.Customer.CustBankAccount,
            CustBankName = invoice.Customer.CustBankName,
            Email = invoice.Customer.Email,
            EmailCc = invoice.Customer.EmailCc
        } : null;

        var itemsDto = invoice.Items.Select(i => new InvoiceItemDto
        {
            Id = i.Id,
            ItmCd = i.ItmCd,
            ItmName = i.ItmName,
            ItmKnd = int.TryParse(i.ItmKnd, out var itmKnd) ? itmKnd : 1,
            UnitNm = i.UnitNm,
            Qty = i.Qty,
            Unprc = i.Unprc,
            Amt = i.Amt,
            DiscRate = i.DiscRate,
            DiscAmt = i.DiscAmt,
            VatRt = i.VatRt,
            VatAmt = i.VatAmt,
            TotalAmt = i.TotalAmt
        }).ToList();

        var detailDto = new InvoiceDetailDto
        {
            Id = invoice.Id,
            UserId = invoice.UserId,
            TaxId = invoice.TaxId,
            TransactionId = invoice.TransactionId,
            InvRef = invoice.InvRef,
            PoNo = invoice.PoNo,
            InvSubTotal = invoice.InvSubTotal,
            InvVatRate = invoice.InvVatRate,
            InvDiscAmount = invoice.InvDiscAmount,
            InvVatAmount = invoice.InvVatAmount,
            InvTotalAmount = invoice.InvTotalAmount,
            ExchCd = invoice.ExchCd,
            ExchRt = invoice.ExchRt,
            PaidTp = invoice.PaidTp,
            Note = invoice.Note,
            HdNo = int.TryParse(invoice.HdNo, out var hdNo) ? hdNo : 0,
            CreatedDate = invoice.CreatedDate,
            ClsfNo = invoice.ClsfNo,
            SpcfNo = invoice.SpcfNo,
            TemplateCode = invoice.TemplateCode,
            BankAccount = invoice.BankAccount,
            BankName = invoice.BankName,
            Status = invoice.Status,
            InvoiceType = invoice.InvoiceType,
            NoteDesc = invoice.NoteDesc,
            Customer = customerDto,
            Items = itemsDto
        };

        return ApiResult<InvoiceDetailDto>.Success(detailDto, "Lấy chi tiết hóa đơn thành công");
    }

    private async Task<Database.Entities.Invoice?> SaveInvoiceToDbAsync(
        InvoiceIssuanceDto dto, int userId, int taxId, InvoiceType type,
        string? oldId = null, string? noteDesc = null)
    {
        var invoice = MapBaseInvoice(dto, userId, taxId);
        invoice.InvoiceType = (sbyte)type;
        invoice.TransactionIdOld = oldId;
        invoice.NoteDesc = noteDesc;

        var success = await _repository.CreateInvoiceAsync(invoice);
        return success ? invoice : null;
    }


    private static Database.Entities.Invoice MapBaseInvoice(InvoiceIssuanceDto dto, int userId, int taxId)
    {
        return new Database.Entities.Invoice
        {
            UserId = userId,
            TaxId = taxId,
            TransactionId = dto.TransactionId,
            InvRef = dto.InvRef,
            PoNo = dto.PoNo,
            InvSubTotal = dto.InvSubTotal,
            InvVatRate = dto.InvVatRate,
            InvDiscAmount = dto.InvDiscAmount,
            InvVatAmount = dto.InvVatAmount,
            InvTotalAmount = dto.InvTotalAmount,
            PaidTp = dto.PaidTp,
            Note = dto.Note,
            ExchCd = dto.ExchCd,
            ExchRt = dto.ExchRt,
            BankAccount = dto.BankAccount,
            BankName = dto.BankName,
            Status = false,
            CreatedAt = DateTime.Now,
            HdNo = (dto.HdNo ?? 0).ToString(),

            Customer = new InvoiceCustomer
            {
                CustCd = dto.Customer.CustCd,
                CustNm = dto.Customer.CustNm,
                CustCompany = dto.Customer.CustCompany,
                TaxCode = dto.Customer.TaxCode,
                CustCity = dto.Customer.CustCity,
                CustDistrict = dto.Customer.CustDistrictName,
                CustAddrs = dto.Customer.CustAddrs,
                CustPhone = dto.Customer.CustPhone,
                CustBankAccount = dto.Customer.CustBankAccount,
                CustBankName = dto.Customer.CustBankName,
                Email = dto.Customer.Email,
                EmailCc = dto.Customer.EmailCC
            },

            Items = dto.Products.Select(p => new InvoiceItem
            {
                ItmCd = p.ItmCd,
                ItmName = p.ItmName,
                ItmKnd = p.ItmKnd.ToString(),
                UnitNm = p.UnitNm,
                Qty = p.Qty,
                Unprc = p.Unprc,
                Amt = p.Amt,
                DiscRate = p.DiscRate,
                DiscAmt = p.DiscAmt,
                VatRt = p.VatRt,
                VatAmt = p.VatAmt,
                TotalAmt = p.TotalAmt
            }).ToList()
        };
    }
}
