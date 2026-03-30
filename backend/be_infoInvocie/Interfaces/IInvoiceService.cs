using be_infoInvoice.Core.DTOs;
using be_infoInvoice.Database.Entities;

namespace be_infoInvoice.Interfaces;

public interface IInvoiceService
{
    Task<IEnumerable<Provider>> GetAvailableProvidersAsync();
    
    // Handle Login and return success or fail
    Task<bool> AuthenticateAndSaveSessionAsync(LoginRequest request);
}