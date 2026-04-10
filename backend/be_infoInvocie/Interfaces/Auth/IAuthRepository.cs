using be_infoInvoice.Database.Entities;

namespace be_infoInvoice.Interfaces.Auth;

public interface IAuthRepository
{
    Task<IEnumerable<Provider>> GetProvidersAsync();
    Task<User?> GetUserByUsernameAsync(string username);
    Task<UserAccessConfig?> GetAccessConfigDetailsAsync(int userId, string maDvcs, int providerId);
    Task<IEnumerable<object>> GetProviderConfigsAsync(int providerId);
    Task SaveRefreshTokenAsync(RefreshToken token);
}
