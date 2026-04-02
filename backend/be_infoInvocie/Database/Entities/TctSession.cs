using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace be_infoInvoice.Database.Entities;

[Table("tct_sessions")]
public class TctSession
{
    [Key]
    public int Id { get; set; }

    [Column("account_id")]
    public int AccountId { get; set; }

    [Required]
    [MaxLength(500)]
    [Column("session_token")]
    public string SessionToken { get; set; } = null!;

    [Column("created_at")]
    public DateTime? CreatedAt { get; set; } = DateTime.Now;

    [Column("expires_at")]
    public DateTime ExpiresAt { get; set; }

    [ForeignKey("AccountId")]
    public TctAccount? Account { get; set; }
}
