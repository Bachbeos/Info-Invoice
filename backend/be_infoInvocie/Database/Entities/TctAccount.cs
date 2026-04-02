using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace be_infoInvoice.Database.Entities;

[Table("tct_accounts")]
public class TctAccount
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    [Column("tax_code")]
    public string TaxCode { get; set; } = null!;

    [Required]
    [MaxLength(100)]
    [Column("username")]
    public string Username { get; set; } = null!;

    [Required]
    [MaxLength(255)]
    [Column("password")]
    public string Password { get; set; } = null!;

    [Column("created_at")]
    public DateTime? CreatedAt { get; set; } = DateTime.Now;

    public ICollection<TctSession>? Sessions { get; set; }
}
