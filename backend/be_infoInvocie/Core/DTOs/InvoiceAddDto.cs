using System.ComponentModel.DataAnnotations;

namespace be_infoInvoice.Core.DTOs;

public class InvoiceAddDto {
    public string TransactionId { get; set; } = null!;
    public string InvRef { get; set; } = null!;
    public string? PoNo { get; set; }
    public decimal InvSubTotal { get; set; }
    public string? InvVatRate { get; set; }
    public decimal InvDiscAmount { get; set; }
    public decimal InvVatAmount { get; set; }
    public decimal InvTotalAmount { get; set; }
    public string PaidTp { get; set; } = null!;
    public string? Note { get; set; }
    public int? HdNo { get; set; }
    public DateTime CreatedDate { get; set; }
    public string ClsfNo { get; set; } = string.Empty;
    public string SpcfNo { get; set; } = string.Empty;
    public string TemplateCode { get; set; } = string.Empty;
    public string? ExchCd { get; set; }
    public decimal ExchRt { get; set; }
    public string? BankAccount { get; set; }
    public string? BankName { get; set; }
    public CustomerDto Customer { get; set; } = null!;
    public List<ItemDto> Products { get; set; } = new();
}

public class CustomerDto {
    public string? CustCd { get; set; }
    public string CustNm { get; set; } = null!;
    public string? CustCompany { get; set; }
    public string? TaxCode { get; set; }
    public string? CustCity { get; set; }
    public string? CustDistrict { get; set; }
    public string? CustAddrs { get; set; }
    public string? CustPhone { get; set; }
    public string? CustBankAccount { get; set; }
    public string? CustBankName { get; set; }
    public string? Email { get; set; }
    public string? EmailCc { get; set; }
}

public class ItemDto
{
    public string? ItmCd { get; set; }
    public string ItmName { get; set; } = null!;
    public int ItmKnd { get; set; } = 1;
    public string? UnitNm { get; set; }
    public decimal Qty { get; set; }
    public decimal Unprc { get; set; }
    public decimal Amt { get; set; }
    public decimal DiscRate { get; set; }
    public decimal DiscAmt { get; set; }
    public string VatRt { get; set; } = "10";
    public decimal VatAmt { get; set; }
    public decimal TotalAmt { get; set; }
}