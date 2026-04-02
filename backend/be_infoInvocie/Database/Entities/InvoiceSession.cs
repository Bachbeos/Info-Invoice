using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace be_infoInvoice.Database.Entities;

[Table("invoice_sessions")]
public class InvoiceSession
{
    public int Id { get; set; }
    [Column("provider_id")]
    public int ProviderId { get; set; }
    [MaxLength(1000)]
    public string Url { get; set; } = null!;
    [MaxLength(50)]
    [Column("ma_dvcs")]
    public string MaDvcs { get; set; } = null!;
    [MaxLength(25)]
    public string Username { get; set; } = null!;
    [MaxLength(25)]
    public string Password { get; set; } = null!;
    [MaxLength(25)]
    [Column("tenant_id")]
    public string? TenantId { get; set; }
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public Provider? Provider { get; set; }
    
    [Column("api_key")]
    public string? ApiKey { get; set; }
}