using System.ComponentModel.DataAnnotations.Schema;

namespace be_infoInvoice.Database.Entities;

[Table("invoices")]
public class Invoice {
    public int Id { get; set; }
    [Column("session_id")] public int SessionId { get; set; }
    [Column("transaction_id")] public string TransactionId { get; set; } = null!;
    [Column("inv_ref")] public string InvRef { get; set; } = null!;
    [Column("po_no")] public string? PoNo { get; set; }
    [Column("inv_sub_total")] public decimal InvSubTotal { get; set; }
    [Column("inv_vat_rate")] public string? InvVatRate { get; set; }
    [Column("inv_disc_amount")] public decimal InvDiscAmount { get; set; }
    [Column("inv_vat_amount")] public decimal InvVatAmount { get; set; }
    [Column("inv_total_amount")] public decimal InvTotalAmount { get; set; }
    [Column("paid_tp")] public string PaidTp { get; set; } = "CK";
    [Column("note")] public string? Note { get; set; }
    [Column("exch_cd")] public string? ExchCd { get; set; }
    [Column("exch_rt")] public decimal ExchRt { get; set; }
    [Column("bank_account")] public string? BankAccount { get; set; }
    [Column("bank_name")] public string? BankName { get; set; }
    [Column("status")] public bool Status { get; set; }
    [Column("sys_created_at")] public DateTime CreatedAt { get; set; }

    public virtual ICollection<InvoiceItem> Items { get; set; } = new List<InvoiceItem>();
    public virtual InvoiceCustomer? Customer { get; set; }
}