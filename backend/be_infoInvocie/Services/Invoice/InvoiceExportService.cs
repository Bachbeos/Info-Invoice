using be_infoInvoice.Core.DTOs;
using be_infoInvoice.Interfaces.Invoice;

namespace be_infoInvoice.Services.Invoice;

public class InvoiceExportService : IInvoiceExportService
{
    private readonly IInvoiceExportRepository _repository;

    public InvoiceExportService(IInvoiceExportRepository repository)
    {
        _repository = repository;
    }

    public async Task<InvoiceExportResponse> ExportInvoiceXmlAsync(string transactionId, int userId, int taxId)
    {
        // 1. Kiểm tra session/provider
        if (taxId <= 0)
        {
            return new InvoiceExportResponse
            {
                Status  = false,
                Message = "Vui lòng đăng nhập lại để xác thực mã số thuế."
            };
        }

        try
        {
            // TODO: Thay bằng HttpClient gọi API EasyInvoice/SInvoice thật
            // var xmlData = await _easyInvoiceClient.DownloadXml(session.Url, transactionId, session.Username...);

            // GIẢ LẬP: Chuỗi XML đã Base64
            string base64Xml = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48SXZvaWNlPjxUcmFuc2FjdGlvbj5URVNUMDAxPC9UcmFuc2FjdGlvbj48L0l2b2ljZT4=";

            return new InvoiceExportResponse
            {
                Status  = true,
                Message = "Lấy dữ liệu XML thành công!",
                Data    = base64Xml
            };
        }
        catch (Exception ex)
        {
            return new InvoiceExportResponse
            {
                Status  = false,
                Message = "Lỗi kết nối nhà cung cấp: " + ex.Message
            };
        }
    }
}
