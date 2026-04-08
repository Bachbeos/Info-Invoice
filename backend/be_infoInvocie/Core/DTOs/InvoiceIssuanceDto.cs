using System.ComponentModel.DataAnnotations;

namespace be_infoInvoice.Core.DTOs;

public class InvoiceIssuanceDto {
    public string TransactionId { get; set; } = null!;
    public string InvRef { get; set; } = null!;
    public string? PoNo { get; set; }
    [Required(ErrorMessage ="Tổng tiền hàng là bắt buộc")]
    public decimal InvSubTotal { get; set; }
    public string? InvVatRate { get; set; }
    public decimal InvDiscAmount { get; set; }
    [Required(ErrorMessage = "Tổng tiền thuế là bắt buộc")]
    public decimal InvVatAmount { get; set; }
    [Required(ErrorMessage = "Tổng tiền là bắt buộc")]
    public decimal InvTotalAmount { get; set; }
    [Required(ErrorMessage = "Phương thức thanh toán là bắt buộc")]
    public string PaidTp { get; set; } = null!;
    public string? Note { get; set; }
    public int HdNo { get; set; }
    public DateTime CreatedDate { get; set; }
    [Required(ErrorMessage ="Mẫu số của hóa đơn là bắt buộc")]
    public string ClsfNo { get; set; }
    [Required(ErrorMessage ="Ký hiệu hóa đơn là bắt buộc")]
    public string SpcfNo { get; set; }
    public string TemplateCode { get; set; }
    public string? ExchCd { get; set; }
    public decimal ExchRt { get; set; }
    public string? BankAccount { get; set; }
    public string? BankName { get; set; }
    public CustomerDto Customer { get; set; } = null!;
    public List<ItemDto> Products { get; set; } = new();
}

public class CustomerDto {
    [Required(ErrorMessage="Mã khách hàng là bắt buộc")]
    public string? CustCd { get; set; }
    [Required(ErrorMessage ="Tên khách hàng là bắt buộc")]
    public string CustNm { get; set; } = null!;
    public string? CustCompany { get; set; }
    [Required(ErrorMessage ="Mã số thuế là bắt buộc")]
    public string? TaxCode { get; set; }
    public string? CustCity { get; set; }
    public string? CustDistrictName { get; set; }
    public string? CustAddrs { get; set; }
    [Required(ErrorMessage ="Số điện thoại khách hàng là bắt buộc")]
    public string? CustPhone { get; set; }
    public string? CustBankAccount { get; set; }
    public string? CustBankName { get; set; }
    public string? Email { get; set; }
    public string? EmailCC { get; set; }
}

public class ItemDto
{
    [Required(ErrorMessage = "Mã sản phẩm là bắt buộc")]
    public string? ItmCd { get; set; }
    [Required(ErrorMessage ="Tên sản phẩm là bắt buộc")]
    public string ItmName { get; set; } = null!;
    public int ItmKnd { get; set; } = 1;
    [Required(ErrorMessage ="Đơn vị tính là bắt buộc")]
    public string? UnitNm { get; set; }
    [Required(ErrorMessage = "Số lượng là bắt buộc")]
    public decimal Qty { get; set; }
    [Required(ErrorMessage = "Đơn giá là bắt buộc")]
    public decimal Unprc { get; set; }
    [Required(ErrorMessage = "Tổng tiền là bắt buộc")]
    public decimal Amt { get; set; }
    public decimal DiscRate { get; set; }
    public decimal DiscAmt { get; set; }
    public string VatRt { get; set; } = "10";
    public decimal VatAmt { get; set; }
    public decimal TotalAmt { get; set; }
}