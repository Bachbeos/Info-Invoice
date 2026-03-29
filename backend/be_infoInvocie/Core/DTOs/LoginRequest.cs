namespace be_infoInvoice.Core.DTOs;

public class LoginRequest
{
    public int ProviderId { get; set; }
    public string Url { get; set; } = null!;
    public string MaDvcs { get; set; } = null!;
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string? TenantId { get; set; }
}