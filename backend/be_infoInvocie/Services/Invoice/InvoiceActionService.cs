using be_infoInvoice.Core.DTOs;
using be_infoInvoice.Database.Entities;
using be_infoInvoice.Interfaces.Invoice;
using be_infoInvoice.Interfaces.Invoice.Validators;

namespace be_infoInvoice.Services.Invoice;

public enum InvoiceType { Public = 1, Replace = 2, Adjust = 3 }

public class InvoiceActionService : IInvoiceActionService
{
    private readonly IInvoiceActionRepository _repository;
    private readonly IInvoiceValidator _validator;

    public InvoiceActionService(IInvoiceActionRepository repository, IInvoiceValidator validator)
    {
        _repository = repository;
        _validator = validator;
    }

    public async Task<ApiResult<InvoiceAddResponse>> AddInvoiceAsync(InvoiceAddDto dto, int userId, int taxId)
    {
        var (isValid, validationMessage) = _validator.ValidateInvoice(dto);
        if (!isValid)
        {
            return ApiResult<InvoiceAddResponse>.Failure(400, validationMessage);
        }

        if (taxId <= 0)
        {
            return ApiResult<InvoiceAddResponse>.Failure(401, "Vui lòng đăng nhập lại để xác thực mã số thuế.");
        }

        var invoice = await SaveInvoiceToDbAsync(dto, userId, taxId, InvoiceType.Public);
        if (invoice == null)
        {
            return ApiResult<InvoiceAddResponse>.Failure(500, "Lỗi hệ thống: Không thể lưu dữ liệu hóa đơn.");
        }

        var responseData = new InvoiceAddResponse
        {
            InvoiceNo = string.Empty,
            InvDate = DateTime.Now.ToString("yyyy-MM-dd"),
            TransactionId = dto.TransactionId,
            Macqt = string.Empty
        };

        return ApiResult<InvoiceAddResponse>.Success(responseData, "Phát hành hóa đơn thành công!");
    }

    //public async Task<bool> ReplaceInvoiceAsync(InvoiceReplaceDto dto, int userId, int taxId)
    //{
    //    if (taxId <= 0) return false;
    //    var invoice = await SaveInvoiceToDbAsync(dto, userId, taxId, InvoiceType.Replace, dto.TransactionIdOld, dto.Note);
    //    return invoice != null;
    //}

    public async Task<bool> UpdateInvoiceAsync(InvoiceUpdateDto dto, int userId, int taxId)
    {
        if (taxId <= 0) return false;

        var invoice = MapBaseInvoice(dto, userId, taxId);
        invoice.InvoiceType = (sbyte)InvoiceType.Adjust;

        return await _repository.UpdateInvoiceAsync(invoice);
    }

    public async Task<ApiResult<bool>> DeleteInvoiceAsync(int id, int userId, int taxId)
    {
        if (userId <= 0 || taxId <= 0)
        {
            return ApiResult<bool>.Failure(401, "Thông tin xác thực không hợp lệ.");
        }

        var deleted = await _repository.DeleteAsync(id, userId, taxId);

        if (!deleted)
        {
            return ApiResult<bool>.Failure(404, "Không tìm thấy hóa đơn hoặc bạn không có quyền xóa.");
        }

        return ApiResult<bool>.Success(true, "Xóa hóa đơn thành công.");
    }

    private async Task<Database.Entities.Invoice?> SaveInvoiceToDbAsync(
        InvoiceAddDto dto, int userId, int taxId, InvoiceType type,
        string? oldId = null, string? noteDesc = null)
    {
        var invoice = MapBaseInvoice(dto, userId, taxId);
        invoice.InvoiceType = (sbyte)type;
        invoice.TransactionIdOld = oldId;
        invoice.NoteDesc = noteDesc;

        var success = await _repository.CreateInvoiceAsync(invoice);
        return success ? invoice : null;
    }


    private static Database.Entities.Invoice MapBaseInvoice(InvoiceAddDto dto, int userId, int taxId)
    {
        return new Database.Entities.Invoice
        {
            UserId = userId,
            TaxId = taxId,
            TransactionId = dto.TransactionId,
            InvRef = dto.InvRef,
            PoNo = dto.PoNo,
            InvSubTotal = dto.InvSubTotal,
            InvVatRate = string.IsNullOrWhiteSpace(dto.InvVatRate) ? null : dto.InvVatRate,
            InvDiscAmount = dto.InvDiscAmount,
            InvVatAmount = dto.InvVatAmount,
            InvTotalAmount = dto.InvTotalAmount,
            PaidTp = dto.PaidTp,
            Note = dto.Note,
            ExchCd = dto.ExchCd,
            ExchRt = dto.ExchRt,
            BankAccount = dto.BankAccount,
            BankName = dto.BankName,
            CreatedAt = DateTime.Now,
            HdNo = (dto.HdNo ?? 0).ToString(),
            ClsfNo = dto.ClsfNo,
            SpcfNo = dto.SpcfNo,
            TemplateCode = dto.TemplateCode,
            CreatedDate = dto.CreatedDate,

            Customer = new InvoiceCustomer
            {
                CustCd = dto.Customer.CustCd,
                CustNm = dto.Customer.CustNm,
                CustCompany = dto.Customer.CustCompany,
                TaxCode = dto.Customer.TaxCode,
                CustCity = dto.Customer.CustCity,
                CustDistrict = dto.Customer.CustDistrict,
                CustAddrs = dto.Customer.CustAddrs,
                CustPhone = dto.Customer.CustPhone,
                CustBankAccount = dto.Customer.CustBankAccount,
                CustBankName = dto.Customer.CustBankName,
                Email = dto.Customer.Email,
                EmailCc = dto.Customer.EmailCc
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
                VatRt = string.IsNullOrWhiteSpace(p.VatRt) ? "0" : p.VatRt,
                VatAmt = p.VatAmt,
                TotalAmt = p.TotalAmt
            }).ToList()
        };
    }
}
