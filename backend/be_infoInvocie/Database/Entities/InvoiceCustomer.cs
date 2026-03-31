using System.ComponentModel.DataAnnotations.Schema;

namespace be_infoInvoice.Database.Entities;

[Table("invoice_customers")]
public class InvoiceCustomer {
    public int Id { get; set; }
    [Column("invoice_id")] public int InvoiceId { get; set; }
    [Column("cust_cd")] public string? CustCd { get; set; }
    [Column("cust_nm")] public string CustNm { get; set; } = null!;
    [Column("cust_company")] public string? CustCompany { get; set; }
    [Column("tax_code")] public string? TaxCode { get; set; }
    [Column("cust_city")] public string? CustCity { get; set; }
    [Column("cust_district")] public string? CustDistrict { get; set; }
    [Column("cust_addrs")] public string? CustAddrs { get; set; }
    [Column("cust_phone")] public string? CustPhone { get; set; }
    [Column("cust_bank_account")] public string? CustBankAccount { get; set; }
    [Column("cust_bank_name")] public string? CustBankName { get; set; }
    [Column("email")] public string? Email { get; set; }
    [Column("email_cc")] public string? EmailCc { get; set; } 
}