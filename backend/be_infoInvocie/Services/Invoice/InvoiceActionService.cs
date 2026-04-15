using be_infoInvoice.Core.DTOs;
using be_infoInvoice.Database.Entities;
using be_infoInvoice.Interfaces.Invoice;
using be_infoInvoice.Interfaces.Invoice.Validators;
using System.Text.Json;
using System.Net.Http;
using System.Text;

namespace be_infoInvoice.Services.Invoice;

public enum InvoiceType { Publish = 1, Replace = 2, Adjust = 3 }

public class InvoiceActionService : IInvoiceActionService
{
    private static readonly DateTime SqlServerMinDate = new(1753, 1, 1);

    private readonly IInvoiceActionRepository _repository;
    private readonly IInvoiceValidator _validator;
    private readonly IHttpClientFactory _httpClientFactory;

    public InvoiceActionService(IInvoiceActionRepository repository, IInvoiceValidator validator, IHttpClientFactory httpClientFactory)
    {
        _repository = repository;
        _validator = validator;
        _httpClientFactory = httpClientFactory;
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

        var invoice = await SaveInvoiceToDbAsync(dto, userId, taxId, InvoiceType.Publish);
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
    public async Task<ApiResult<bool>> PublishInvoiceAsync(int userId, int taxId, int invoiceId)
    {
        var invoice = userId > 0 && taxId > 0
            ? await _repository.GetInvoiceWithDetailsAsync(invoiceId, userId, taxId)
            : await _repository.GetInvoiceWithDetailsByIdAsync(invoiceId);

        if (invoice == null)
        {
            return ApiResult<bool>.Failure(404, "Không tìm thấy hóa đơn hoặc bạn không có quyền truy cập.");
        }

        var payload = new
        {
            login = new
            {
                providerId = 7,
                url = "https://minvoice.site",
                ma_dvcs = "0106026495-999",
                username = "erp",
                password = "04!tp31F13sa#!",
                tenantId = ""
            },
            transactionID = invoice.TransactionId ?? "",
            invRef = invoice.InvRef ?? "",
            invSubTotal = invoice.InvSubTotal,
            invVatRate = invoice.InvVatRate,
            invVatAmount = invoice.InvVatAmount,
            invDiscAmount = invoice.InvDiscAmount,
            invTotalAmount = invoice.InvTotalAmount,
            paidTp = invoice.PaidTp ?? "TM",
            note = invoice.Note ?? "",
            hdNo = invoice.HdNo ?? "",
            createdDate = GetSqlSafeDate(invoice.CreatedDate).ToString("yyyy-MM-dd"),
            clsfNo = invoice.ClsfNo ?? "1",
            spcfNo = invoice.SpcfNo ?? "",
            templateCode = invoice.TemplateCode ?? "",
            exchCd = invoice.ExchCd ?? "VND",
            exchRt = invoice.ExchRt,
            bankAccount = invoice.BankAccount ?? "",
            bankName = invoice.BankName ?? "",
            customer = invoice.Customer != null ? new
            {
                custCd = invoice.Customer.CustCd ?? "",
                custNm = invoice.Customer.CustNm ?? "",
                custCompany = invoice.Customer.CustCompany ?? "",
                taxCode = invoice.Customer.TaxCode ?? "",
                custCity = invoice.Customer.CustCity ?? "",
                custDistrictName = invoice.Customer.CustDistrict ?? "",
                custAddrs = invoice.Customer.CustAddrs ?? "",
                custPhone = invoice.Customer.CustPhone ?? "",
                custBankAccount = invoice.Customer.CustBankAccount ?? "",
                custBankName = invoice.Customer.CustBankName ?? "",
                email = invoice.Customer.Email ?? "",
                emailCC = invoice.Customer.EmailCc ?? ""
            } : null,
            products = invoice.Items.Select(item => new
            {
                itmCd = item.ItmCd ?? "",
                itmName = item.ItmName ?? "",
                itmKnd = int.TryParse(item.ItmKnd, out int knd) ? knd : 1,
                unitNm = item.UnitNm ?? "",
                qty = item.Qty,
                unprc = item.Unprc,
                amt = item.Amt,
                discRate = item.DiscRate,
                discAmt = item.DiscAmt,
                vatRt = item.VatRt ?? "0",
                vatAmt = item.VatAmt,
                totalAmt = item.TotalAmt
            }).ToList()
        };

        var jsonOptions = new JsonSerializerOptions
        {
            Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
            PropertyNamingPolicy = null
        };
        string jsonPayload = JsonSerializer.Serialize(payload, jsonOptions);

        var request = new HttpRequestMessage(HttpMethod.Post, "http://infoerpvn.com:9442/api/invoice/publish");

        request.Headers.Clear();
        request.Headers.TryAddWithoutValidation("token", "EnURbbnPhUm4GjNgE4Ogrw==");

        var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
        content.Headers.ContentType!.CharSet = "";
        request.Content = content;

        var client = _httpClientFactory.CreateClient();
        try
        {
            var response = await client.SendAsync(request);
            var responseString = await response.Content.ReadAsStringAsync();
            var debugInfo = $"tx={invoice.TransactionId ?? ""};invRef={invoice.InvRef ?? ""};createdDate={GetSqlSafeDate(invoice.CreatedDate):yyyy-MM-dd};clsfNo={invoice.ClsfNo ?? ""};spcfNo={invoice.SpcfNo ?? ""};items={invoice.Items.Count}";

            if (!response.IsSuccessStatusCode)
            {
                return ApiResult<bool>.Failure((int)response.StatusCode, $"Lỗi từ server bên thứ 3: {responseString} | Debug: {debugInfo}");
            }

            var result = JsonSerializer.Deserialize<MinInvoicePublishResponseDto>(responseString, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (result != null && result.Status && result.Data != null)
            {
                invoice.HdNo = result.Data.InvoiceNo;
                invoice.TransactionId = result.Data.TransactionID;
                invoice.Macqt = result.Data.Macqt;

                if (DateTime.TryParse(result.Data.InvDate.ToString(), out DateTime parsedDate))
                {
                    invoice.CreatedDate = parsedDate;
                }

                var isSaved = await _repository.UpdateInvoiceAsync(invoice);

                return isSaved
                    ? ApiResult<bool>.Success(true, "Phát hành hóa đơn thành công!")
                    : ApiResult<bool>.Failure(500, "Phát hành thành công nhưng lỗi khi cập nhật CSDL nội bộ.");
            }

            return ApiResult<bool>.Failure(400, result?.Message ?? "Phát hành thất bại từ phía nhà cung cấp.");
        }
        catch (Exception ex)
        {
            return ApiResult<bool>.Failure(500, $"Lỗi kết nối hệ thống: {ex.Message}");
        }
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
            CreatedDate = GetSqlSafeDate(dto.CreatedDate),

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

    private static DateTime GetSqlSafeDate(DateTime date)
    {
        return date < SqlServerMinDate ? DateTime.Today : date;
    }

}
