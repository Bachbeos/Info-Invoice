namespace be_infoInvoice.Core.DTOs;

public class InvoiceReplaceDto : InvoiceIssuanceDto
{
    public string TransactionIdOld { get; set; } = null!;
}

public class InvoiceAdjustDto : InvoiceIssuanceDto
{
    public string TransactionIdOld { get; set; } = null!;
}

public class InvoiceIssueResponse
{
    public int Code { get; set; }
    public int Status { get; set; }
    public string Message { get; set; } = null!;
    public InvoiceIssueData? Data { get; set; }
}

public class InvoiceIssueData
{
    public string InvoiceNo { get; set; } = string.Empty;
    public string InvDate { get; set; } = string.Empty;
    public string TransactionId { get; set; } = string.Empty;
    public string Macqt { get; set; } = string.Empty;
}

public class InvoiceExportResponse
{
    public bool Status { get; set; }
    public string Message { get; set; } = null!;
    public string Data { get; set; } = null!; 
}