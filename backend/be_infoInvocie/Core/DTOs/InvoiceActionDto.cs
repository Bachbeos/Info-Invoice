namespace be_infoInvoice.Core.DTOs;

public class InvoiceReplaceDto : InvoiceAddDto
{
    public string TransactionIdOld { get; set; } = null!;
}

public class InvoiceUpdateDto : InvoiceAddDto
{
    public string TransactionIdOld { get; set; } = null!;
}

public class InvoiceAddResponse
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