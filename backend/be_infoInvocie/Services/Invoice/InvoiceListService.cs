using be_infoInvoice.Core.DTOs;
using be_infoInvoice.Interfaces.Invoice;

namespace be_infoInvoice.Services.Invoice
{
    public class InvoiceListService(IInvoiceListRepository repository) : IInvoiceListService
    {
        public async Task<ApiResult<InvoiceListResponse>> GetInvoicesAsync(int userId, int taxId, InvoiceListRequest request)
        {
            if (userId <= 0 || taxId <= 0)
            {
                return ApiResult<InvoiceListResponse>.Failure(401, "Thông tin xác thực không hợp lệ.");
            }

            var (items, total) = await repository.GetInvoicesAsync(userId, taxId, request);

            var totalPages = (int)Math.Ceiling((double)total / request.PageSize);

            var response = new InvoiceListResponse
            {
                Total = total,
                Page = request.Page,
                PageSize = request.PageSize,
                TotalPages = totalPages,
                Items = items
            };

            return ApiResult<InvoiceListResponse>.Success(response, "Lấy danh sách hóa đơn thành công.");
        }

        public async Task<ApiResult<InvoiceDetailDto>> GetInvoiceDetailAsync(int id, int userId, int taxId)
        {
            var invoice = await repository.GetByIdAsync(id, userId, taxId);

            if (invoice == null)
            {
                return ApiResult<InvoiceDetailDto>.Failure(404, "Không tìm thấy hóa đơn hoặc bạn không có quyền truy cập.");
            }

            var detailDto = new InvoiceDetailDto
            {
                Id = invoice.Id,
                UserId = invoice.UserId,
                TaxId = invoice.TaxId,
                TransactionId = invoice.TransactionId,
                InvRef = invoice.InvRef ?? string.Empty,
                PoNo = invoice.PoNo,
                InvTotalAmount = invoice.InvTotalAmount,
                HdNo = invoice.HdNo,
                CreatedDate = invoice.CreatedDate,
                InvoiceType = invoice.InvoiceType,

                Customer = invoice.Customer == null ? null : new InvoiceCustomerDto
                {
                    CustNm = invoice.Customer.CustNm,
                    CustCompany = invoice.Customer.CustCompany,
                    TaxCode = invoice.Customer.TaxCode,
                    CustAddrs = invoice.Customer.CustAddrs,
                    Email = invoice.Customer.Email,
                    CustPhone = invoice.Customer.CustPhone,
                },

                Items = invoice.Items.Select(item => new InvoiceItemDto
                {
                    Id = item.Id,
                    ItmName = item.ItmName,
                    Qty = item.Qty,
                    Unprc = item.Unprc,
                    Amt = item.Amt,
                    VatAmt = item.VatAmt,
                    TotalAmt = item.TotalAmt
                }).ToList()
            };

            return ApiResult<InvoiceDetailDto>.Success(detailDto, "Lấy chi tiết hóa đơn thành công.");
        }
    }
}
