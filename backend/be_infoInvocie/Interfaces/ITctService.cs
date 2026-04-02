using be_infoInvoice.Core.DTOs;

namespace be_infoInvoice.Interfaces;

public interface ITctService
{
    Task<TctLoginResponse> LoginAsync(TctLoginRequest request);
    Task<TctInvoiceListResponse> SyncInvoicesAsync(TctSyncRequest request);
    Task<object> GetInvoiceDetailAsync(TctDetailRequest request);
    Task<string> GetInvoiceXmlAsync(TctXmlRequest request);
}
