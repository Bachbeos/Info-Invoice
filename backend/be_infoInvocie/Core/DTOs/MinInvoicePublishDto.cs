namespace be_infoInvoice.Core.DTOs
{
    public class MinInvoicePublishResponseDto
    {
        public bool Status { get; set; }
        public string Message { get; set; } = string.Empty;
        public MinInvoicePublishData? Data { get; set; }
    }

    public class MinInvoicePublishData
    {
        public string InvoiceNo { get; set; } = string.Empty;
        public DateTime InvDate { get; set; }
        public string TransactionID { get; set; } = string.Empty;
        public string Macqt { get; set; } = string.Empty;
    }
}
