using System.ComponentModel.DataAnnotations.Schema;

namespace be_infoInvoice.Database.Entities;

[Table("refresh_tokens")]
public class RefreshToken
{
    public int Id { get; set; }
    [Column("session_id")]
    public int SessionId { get; set; }
    public string Token { get; set; } = null!;
    [Column("expires_at")]
    public DateTime ExpiresAt { get; set; }
    [Column("is_revoked")]
    public bool IsRevoked { get; set; } = false;
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    
    [ForeignKey("SessionId")]
    public InvoiceSession? Session { get; set; }
}