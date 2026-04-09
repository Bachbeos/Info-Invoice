namespace be_infoInvoice.Core.DTOs
{
    public class UserLoginRequest
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
        public int ProviderId { get; set; }
        public string Url { get; set; } = null!;
        public string MaDvcs { get; set; } = null!;
    }
}
