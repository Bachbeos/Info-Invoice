using be_infoInvoice.Core.DTOs;

namespace be_infoInvoice.Interfaces.Invoice
{
    public interface IInvoiceListRepository
    {
        Task<(List<InvoiceListItemDto>Items, int TotalCount)> GetInvoicesAsync(int userId, int taxId, InvoiceListRequest request);
        Task<Database.Entities.Invoice?> GetByIdAsync(int id, int userId, int taxId);
    }
}
