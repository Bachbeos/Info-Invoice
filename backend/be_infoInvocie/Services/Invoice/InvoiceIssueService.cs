using be_infoInvoice.Core.DTOs;
using be_infoInvoice.Database.Entities;
using be_infoInvoice.Interfaces.Invoice;
using be_infoInvoice.Interfaces.Invoice.Validators;

namespace be_infoInvoice.Services.Invoice;

public enum InvoiceType { Public = 1, Replace = 2, Adjust = 3}

public class InvoiceIssueService : IInvoiceIssueService
{
    private readonly IInvoiceIssueRepository _repository;
    private readonly IInvoiceValidator _validator;

    public InvoiceIssueService(IInvoiceIssueRepository repository, IInvoiceValidator validator)
    {
        _repository = repository;
        _validator = validator;
    }

    public async Task<ApiResult<InvoiceIssueResponse>> IssueInvoiceAsync(InvoiceIssuanceDto dto, int sessionId)
    {

        //var (isValid, validationMessage) = _validator.ValidateInvoice(dto);
        //if (!isValid) {
        //    return new InvoiceIssueResponse
        //    {
        //        Code = 400,
        //        Status = 0,
        //        Message = validationMessage
        //    }; 
        //}

        //var session = await _repository.GetSessionByIdAsync(sessionId);
        //if (session == null)
        //{
        //    return new InvoiceIssueResponse { Code = 401, Message = "Phiên làm việc không hợp lệ." };
        //}

        //var invoice = await SaveInvoiceToDbAsync(dto, sessionId, InvoiceType.Public);
        //if (invoice == null)
        //{
        //    return new InvoiceIssueResponse { Code = 500, Message = "Lỗi lưu dữ liệu hóa đơn." };
        //}

        //var invoice = await SaveInvoiceToDbAsync(dto, sessionId, InvoiceType.Public);
        //if (invoice == null)
        //{
        //    return CreateErrorResponse("Lưu hóa đơn thất bại. Vui lòng kiểm tra lại dữ liệu.");
        //}

        // TODO: Gọi API nhà cung cấp
        //return new InvoiceIssueResponse
        //{
        //    Code = 200,
        //    Status = 1,
        //    Message = "Lưu hóa đơn vào hệ thống thành công!",
        //    Data = new InvoiceIssueData
        //    {
        //        InvoiceNo     = string.Empty,
        //        InvDate       = DateTime.Now.ToString("yyyy-MM-dd"),
        //        TransactionId = dto.TransactionId,
        //        Macqt         = string.Empty
        //    }
        //};

        var (isValid, validationMessage) = _validator.ValidateInvoice(dto);
        if (!isValid)
        {
            return ApiResult<InvoiceIssueResponse>.Failure(400, validationMessage);
        }

        var session = await _repository.GetSessionByIdAsync(sessionId);
        if (session == null)
        {
            return ApiResult<InvoiceIssueResponse>.Failure(401, "Phiên làm việc không hợp lệ hoặc đã hết hạn.");
        }

        var invoice = await SaveInvoiceToDbAsync(dto, sessionId, InvoiceType.Public);
        if (invoice == null)
        {
            return ApiResult<InvoiceIssueResponse>.Failure(500, "Lỗi hệ thống: Không thể lưu dữ liệu hóa đơn.");
        }

        var responseData = new InvoiceIssueResponse
        {
            Code = 200,
            Status = 1,
            Message = "Lưu hóa đơn vào hệ thống thành công!",
            Data = new InvoiceIssueData
            {
                InvoiceNo = string.Empty,
                InvDate = DateTime.Now.ToString("yyyy-MM-dd"),
                TransactionId = dto.TransactionId,
                Macqt = string.Empty
            }
        };

        return ApiResult<InvoiceIssueResponse>.Success(responseData, "Phát hành hóa đơn thành công!");
    }

    public async Task<bool> ReplaceInvoiceAsync(InvoiceReplaceDto dto, int sessionId)
    {
        var invoice = await SaveInvoiceToDbAsync(dto, sessionId, InvoiceType.Replace, dto.TransactionIdOld, dto.Note);

        return invoice != null;
    }

    public async Task<bool> AdjustInvoiceAsync(InvoiceAdjustDto dto, int sessionId)
    {
        var invoice = await SaveInvoiceToDbAsync(dto, sessionId, InvoiceType.Adjust, dto.TransactionIdOld, dto.Note);
        return invoice != null;
    }

    public async Task<Database.Entities.Invoice?> SaveInvoiceToDbAsync(InvoiceIssuanceDto dto, int sessionId, InvoiceType type, string? oldId = null, string? noteDesc = null)
    {
        var invoice = MapBaseInvoice(dto, sessionId);
        invoice.InvoiceType = (sbyte)type;
        invoice.TransactionIdOld = oldId;
        invoice.NoteDesc = noteDesc;

        var success = await _repository.CreateInvoiceAsync(invoice);
        return success ? invoice : null;
    }

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
            HdNo            = dto.HdNo ?? 0,

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
