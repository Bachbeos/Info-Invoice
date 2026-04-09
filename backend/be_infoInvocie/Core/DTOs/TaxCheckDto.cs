namespace be_infoInvoice.Core.DTOs;

public class TaxCheckRequest
{
    public List<string> TaxCodes { get; set; } = new();
}

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

public class TaxCheckResponse
{
    public bool Status { get; set; }
    public string Message { get; set; } = null!;
    public List<TaxStatusResult> Datas { get; set; } = new();
}