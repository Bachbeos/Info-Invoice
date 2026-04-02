namespace be_infoInvoice.Core.DTOs;

// 1. DTO nhận danh sách MST từ Frontend gửi lên
public class TaxCheckRequest
{
    public List<string> TaxCodes { get; set; } = new();
}

// 2. DTO đại diện cho kết quả của TỪNG mã số thuế (Khớp với tài liệu)
public class TaxStatusResult
{
    public string MaSoThue { get; set; } = null!;
    public string MasothueId { get; set; } = null!;
    public string TenCty { get; set; } = null!;
    public string DiaChi { get; set; } = null!;
    public string Tthai { get; set; } = null!;
    public string TrangThaiHoatDong { get; set; } = null!;
    public string LastUpdate { get; set; } = null!;
    public string NgayKiemTra { get; set; } = null!;
}

// 3. DTO tổng quát trả về cho Frontend (Có Status, Message và List kết quả)
public class TaxCheckResponse
{
    public bool Status { get; set; }
    public string Message { get; set; } = null!;
    public List<TaxStatusResult> Datas { get; set; } = new();
}