using System.ComponentModel.DataAnnotations.Schema;

namespace be_infoInvoice.Database.Entities;

[Table("tax_check_history")]
public class TaxCheckHistory
{
    [Column("id")]
    public int Id { get; set; }

    [Column("session_id")]
    public int SessionId { get; set; }

    [Column("tax_code")]
    public string TaxCode { get; set; } = null!;

    [Column("company_name")]
    public string? CompanyName { get; set; }

    [Column("address")]
    public string? Address { get; set; }

    [Column("status_code")]
    public string? StatusCode { get; set; }

    [Column("status_name")]
    public string? StatusName { get; set; }

    [Column("last_update_tax")]
    public string? LastUpdateTax { get; set; }

    [Column("checked_at")]
    public DateTime CheckedAt { get; set; } = DateTime.Now;

    // Navigation property
    public virtual InvoiceSession Session { get; set; } = null!;
}