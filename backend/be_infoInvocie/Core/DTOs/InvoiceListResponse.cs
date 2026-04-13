namespace be_infoInvoice.Core.DTOs
{
    public class InvoiceListResponse
    {
        public int Total { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public IEnumerable<InvoiceListItemDto> Items { get; set; } = new List<InvoiceListItemDto>();
    }

    public class InvoiceListItemDto
    {
        public int Id { get; set; }
        public string TransactionId { get; set; } = null!;
        public string InvRef { get; set; } = null!;
        public decimal InvTotalAmount { get; set; }
        public string ExchCd { get; set; } = "VND";
        public DateTime CreatedAt { get; set; }
        public int InvoiceType { get; set; }
    }

    public class InvoiceDetailDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int TaxId { get; set; }
        public string TransactionId { get; set; } = null!;
        public string InvRef { get; set; } = null!;
        public string? PoNo { get; set; }
        public decimal InvSubTotal { get; set; }
        public string? InvVatRate { get; set; }
        public decimal InvDiscAmount { get; set; }
        public decimal InvVatAmount { get; set; }
        public decimal InvTotalAmount { get; set; }
        public string? ExchCd { get; set; }
        public decimal ExchRt { get; set; }
        public string PaidTp { get; set; } = "CK";
        public string? Note { get; set; }
        public string? HdNo { get; set; } 
        public DateTime CreatedDate { get; set; }
        public string ClsfNo { get; set; } = string.Empty;
        public string SpcfNo { get; set; } = string.Empty;
        public string TemplateCode { get; set; } = string.Empty;
        public string? BankAccount { get; set; }
        public string? BankName { get; set; }
        public bool Status { get; set; }
        public int InvoiceType { get; set; }
        public string? NoteDesc { get; set; }
        public InvoiceCustomerDto? Customer { get; set; }
        public IEnumerable<InvoiceItemDto> Items { get; set; } = new List<InvoiceItemDto>();
    }

    public class InvoiceCustomerDto
    {
        public int Id { get; set; }
        public string? CustCd { get; set; }
        public string? CustNm { get; set; }
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

    public class InvoiceItemDto
    {
        public int Id { get; set; }
        public string? ItmCd { get; set; }
        public string? ItmName { get; set; }
        public int ItmKnd { get; set; }
        public string? UnitNm { get; set; }
        public decimal Qty { get; set; }
        public decimal Unprc { get; set; }
        public decimal Amt { get; set; }
        public decimal DiscRate { get; set; }
        public decimal DiscAmt { get; set; }
        public string? VatRt { get; set; }
        public decimal VatAmt { get; set; }
        public decimal TotalAmt { get; set; }
    }

}
