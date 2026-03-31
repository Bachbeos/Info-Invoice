namespace be_infoInvoice.Core.DTOs;

public class InvoiceReplaceDto : InvoiceIssuanceDto
{
    // Thêm trường quan trọng nhất để biết thay thế cho cái nào
    public string TransactionIdOld { get; set; } = null!;
}

// DTO cho Điều chỉnh hóa đơn
public class InvoiceAdjustDto : InvoiceIssuanceDto
{
    // Thêm trường quan trọng nhất để biết điều chỉnh cho cái nào
    public string TransactionIdOld { get; set; } = null!;
}

public class InvoiceExportResponse
{
    // Trạng thái thành công hay thất bại (true/false)
    public bool Status { get; set; }

    // Thông báo chi tiết (Lấy thành công / Không tìm thấy hóa đơn...)
    public string Message { get; set; } = null!;

    // Cực kỳ quan trọng: Đây là chuỗi XML đã được mã hóa BASE64 
    // FE sẽ nhận cục này để chuyển thành file tải về
    public string Data { get; set; } = null!; 
}