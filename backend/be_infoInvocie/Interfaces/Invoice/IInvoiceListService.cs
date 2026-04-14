using be_infoInvoice.Core.DTOs;

namespace be_infoInvoice.Interfaces.Invoice
{
    public interface IInvoiceListService
    {
        Task<ApiResult<InvoiceListResponse>> GetInvoicesAsync(int userId, int taxId, InvoiceListRequest request);
        Task<ApiResult<InvoiceDetailDto>> GetInvoiceDetailAsync(int id, int userId, int taxId);
    }
}

