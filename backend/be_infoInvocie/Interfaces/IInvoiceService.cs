using be_infoInvoice.Core.DTOs;
using be_infoInvoice.Database.Entities;

namespace be_infoInvoice.Interfaces;

public interface IInvoiceService
{
    Task<IEnumerable<Provider>> GetAvailableProvidersAsync();
    
    // Hàm quan trọng nhất: Xử lý đăng nhập và trả về kết quả thành công/thất bại
    Task<bool> AuthenticateAndSaveSessionAsync(LoginRequest request);
}