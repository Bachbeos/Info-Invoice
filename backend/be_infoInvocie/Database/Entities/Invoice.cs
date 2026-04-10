using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace be_infoInvoice.Database.Entities;

[Table("invoices")]
public class Invoice
{
    public int Id { get; set; }
    [Column("user_id")] public int UserId { get; set; }
    [Column("tax_id")] public int TaxId { get; set; }
    [MaxLength(50)]
    [Column("transaction_id")] public string TransactionId { get; set; } = null!;
    [MaxLength(50)]
    [Column("inv_ref")] public string InvRef { get; set; } = null!;
    [MaxLength(50)]
    [Column("po_no")] public string? PoNo { get; set; }
    [Column("inv_sub_total")] public decimal InvSubTotal { get; set; }
    [MaxLength(50)]
    [Column("inv_vat_rate")] public string? InvVatRate { get; set; }
    [Column("inv_disc_amount")] public decimal InvDiscAmount { get; set; }
    [Column("inv_vat_amount")] public decimal InvVatAmount { get; set; }
    [Column("inv_total_amount")] public decimal InvTotalAmount { get; set; }
    [MaxLength(50)]
    [Column("paid_tp")] public string PaidTp { get; set; } = "CK";
    [MaxLength(255)]
    [Column("note")] public string? Note { get; set; }
    [Column("hd_no")] public string? HdNo { get; set; }
    [Column("created_date")] public DateTime CreatedDate { get; set; }
    [Column("clsf_no")] public string ClsfNo { get; set; } = string.Empty;
    [Column("spcf_no")] public string SpcfNo { get; set; } = string.Empty;
    [Column("template_code")] public string TemplateCode { get; set; } = string.Empty;
    [MaxLength(50)]
    [Column("exch_cd")] public string? ExchCd { get; set; }
    [Column("exch_rt")] public decimal ExchRt { get; set; }
    [MaxLength(50)]
    [Column("bank_account")] public string? BankAccount { get; set; }
    [MaxLength(50)]
    [Column("bank_name")] public string? BankName { get; set; }
    [Column("status")] public bool Status { get; set; }
    [Column("sys_created_at")] public DateTime CreatedAt { get; set; }

    public virtual ICollection<InvoiceItem> Items { get; set; } = new List<InvoiceItem>();
    public virtual InvoiceCustomer? Customer { get; set; }

    [Column("invoice_type")]
    public int InvoiceType { get; set; } = 1; // 1: Gốc, 2: Thay thế, 3: Điều chỉnh

    [Column("transaction_id_old")]
    [MaxLength(50)]
    public string? TransactionIdOld { get; set; }
    [MaxLength(255)]

    [Column("note_desc")]
    public string? NoteDesc { get; set; }
}