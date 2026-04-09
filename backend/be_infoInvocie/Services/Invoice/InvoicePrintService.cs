using be_infoInvoice.Interfaces.Invoice;

namespace be_infoInvoice.Services.Invoice;

public class InvoicePrintService : IInvoicePrintService
{
    private readonly IInvoicePrintRepository _repository;

    public InvoicePrintService(IInvoicePrintRepository repository)
    {
        _repository = repository;
    }

    public async Task<byte[]> PrintInvoicePdfAsync(string transactionId, int userId, int taxId)
    {
        // 1. Kiểm tra session/provider
        if (taxId <= 0)
            throw new Exception("Vui lòng đăng nhập lại để xác thực mã số thuế.");

        // DEMO: Bỏ qua nếu không có ApiKey (thực tế thì throw Exception)
        // if (string.IsNullOrEmpty(session.ApiKey))
        //     throw new Exception("Không tìm thấy ApiKey tích hợp cho phiên làm việc này.");

        // TODO: Thay bằng HttpClient gọi sang EasyInvoice/SInvoice thật
        // var pdfData = await _invoiceClient.GetPdf(session.Url, session.ApiKey, transactionId);

        // GIẢ LẬP: Trả về PDF tối giản hợp lệ
        string pdfContent =
            "%PDF-1.4\n" +
            "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n" +
            "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n" +
            "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 600 400] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n" +
            "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n" +
            "5 0 obj\n<< /Length 61 >>\nstream\nBT\n/F1 18 Tf\n50 300 Td\n(Hoa don mau - Transaction: " + transactionId + ") Tj\nET\nendstream\nendobj\n" +
            "xref\n0 6\n0000000000 65535 f \n0000000010 00000 n \n0000000060 00000 n \n0000000117 00000 n \n0000000244 00000 n \n0000000332 00000 n \n" +
            "trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n445\n%%EOF";

        return System.Text.Encoding.ASCII.GetBytes(pdfContent);
    }
}
