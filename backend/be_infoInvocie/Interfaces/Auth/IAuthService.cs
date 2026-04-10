using be_infoInvoice.Core.DTOs;
using be_infoInvoice.Database.Entities;

namespace be_infoInvoice.Interfaces.Auth;

public interface IAuthService
{
    Task<IEnumerable<Provider>> GetAvailableProvidersAsync();
    Task<ApiResult<object>> AuthenticateAndSaveSessionAsync(LoginRequest request);
    Task<IEnumerable<object>> GetProviderConfigsAsync(int providerId);
}
