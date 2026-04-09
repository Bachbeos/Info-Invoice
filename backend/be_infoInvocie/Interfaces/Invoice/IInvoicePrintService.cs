namespace be_infoInvoice.Interfaces.Invoice;

public interface IInvoicePrintService
{
    Task<byte[]> PrintInvoicePdfAsync(string transactionId, int userId, int taxId);
}
