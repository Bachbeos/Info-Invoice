using System.ComponentModel.DataAnnotations.Schema;

namespace be_infoInvoice.Database.Entities;

[Table("invoice_items")]
public class InvoiceItem {
    public int Id { get; set; }
    [Column("invoice_id")] public int InvoiceId { get; set; }
    [Column("itm_cd")] public string? ItmCd { get; set; }
    [Column("itm_name")] public string ItmName { get; set; } = null!;
    [Column("itm_knd")] public int ItmKnd { get; set; }
    [Column("unit_nm")] public string? UnitNm { get; set; }
    public decimal Qty { get; set; }
    public decimal Unprc { get; set; }
    public decimal Amt { get; set; }
    [Column("disc_rate")] public decimal DiscRate { get; set; }
    [Column("disc_amt")] public decimal DiscAmt { get; set; }
    [Column("vat_rt")] public string VatRt { get; set; } = null!;
    [Column("vat_amt")] public decimal VatAmt { get; set; }
    [Column("total_amt")] public decimal TotalAmt { get; set; }
}