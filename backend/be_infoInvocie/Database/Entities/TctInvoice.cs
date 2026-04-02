using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace be_infoInvoice.Database.Entities;

[Table("tct_invoices")]
public class TctInvoice
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(255)]
    [Column("tct_id")]
    public string TctId { get; set; } = null!;

    [Column("invoice_type")]
    public byte InvoiceType { get; set; }

    [Required]
    [MaxLength(255)]
    [Column("hsgoc")]
    public string Hsgoc { get; set; } = null!;

    [Required]
    [MaxLength(50)]
    [Column("khmshdon")]
    public string Khmshdon { get; set; } = null!;

    [Required]
    [MaxLength(50)]
    [Column("khhdon")]
    public string Khhdon { get; set; } = null!;

    [Required]
    [MaxLength(50)]
    [Column("shdon")]
    public string Shdon { get; set; } = null!;

    [Column("ngay_lap")]
    public DateTime? NgayLap { get; set; }

    [MaxLength(10)]
    [Column("tthai")]
    public string? Tthai { get; set; }

    [MaxLength(10)]
    [Column("ttxly")]
    public string? Ttxly { get; set; }

    [MaxLength(100)]
    [Column("mhdon")]
    public string? Mhdon { get; set; }

    [Required]
    [MaxLength(50)]
    [Column("nbmst")]
    public string Nbmst { get; set; } = null!;

    [MaxLength(255)]
    [Column("nbten")]
    public string? Nbten { get; set; }

    [Column("nbdchi")]
    public string? Nbdchi { get; set; }

    [MaxLength(50)]
    [Column("nmmst")]
    public string? Nmmst { get; set; }

    [MaxLength(255)]
    [Column("nmten")]
    public string? Nmten { get; set; }

    [Column("nmdchi")]
    public string? Nmdchi { get; set; }

    [Column("tgtcthue")]
    public decimal? Tgtcthue { get; set; }

    [Column("tgtthue")]
    public decimal? Tgtthue { get; set; }

    [Column("tgtttbso")]
    public decimal? Tgtttbso { get; set; }

    [MaxLength(10)]
    [Column("dvtte")]
    public string? Dvtte { get; set; }

    [Column("detail_json")]
    public string? DetailJson { get; set; }

    [Column("xml_data")]
    public string? XmlData { get; set; }

    [Column("sync_created_at")]
    public DateTime? SyncCreatedAt { get; set; } = DateTime.Now;
}
