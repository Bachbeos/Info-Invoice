using System.ComponentModel.DataAnnotations.Schema;

namespace be_infoInvoice.Database.Entities
{
    [Table("user_access_configs")]
    public class UserAccessConfig
    {
        public int Id { get; set; }
        [Column("user_id")]
        public int UserId { get; set; }
        [Column("tax_id")]
        public int TaxId { get; set; }
        [Column("provider_id")]
        public int ProviderId { get; set; }
        [Column("provider_username")]
        public string ProviderUserame { get; set; } = null!;
        [Column("provider_password")]
        public string ProviderPassword { get; set; } = null!;
        public required string Url { get; set; }
        [Column("tenant_id")]
        public string? TenantId { get; set; }
        [Column("api_key")]
        public string? ApiKey { get; set; }
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
