using be_infoInvoice.Database;
using be_infoInvoice.Database.Entities;
using be_infoInvoice.Interfaces.Auth;
using Microsoft.EntityFrameworkCore;

namespace be_infoInvoice.Repositories.Auth;

public class AuthRepository : IAuthRepository
{
    private readonly AppDbContext _context;

    public AuthRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Provider>> GetProvidersAsync()
    {
        return await _context.Providers.OrderBy(p => p.Name).ToListAsync();
    }

    public async Task<User?> GetUserByUsernameAsync(string username)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
    }

    public async Task<UserAccessConfig?> GetAccessConfigDetailsAsync(int userId, string maDvcs, int providerId)
    {
        var tax = await _context.TaxIds.FirstOrDefaultAsync(t => t.MaDvcs == maDvcs);
        if (tax == null) return null;

        return await _context.UserAccessConfigs
            .FirstOrDefaultAsync(c => c.UserId == userId && c.TaxId == tax.Id && c.ProviderId == providerId);
    }

    public async Task<IEnumerable<object>> GetProviderConfigsAsync(int providerId)
    {
        var configs = await _context.UserAccessConfigs
            .Where(c => c.ProviderId == providerId)
            .Select(c => new
            {
                Url = c.Url
            })
            .Distinct()
            .ToListAsync();

        return configs;
    }

    public async Task SaveRefreshTokenAsync(RefreshToken token)
    {
        _context.RefreshTokens.Add(token);
        await _context.SaveChangesAsync();
    }
}
