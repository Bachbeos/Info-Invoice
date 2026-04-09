using be_infoInvoice.Core.DTOs;
using be_infoInvoice.Interfaces.Invoice.Validators;

namespace be_infoInvoice.Services.Invoice.Validators;

public class InvoiceValidator : IInvoiceValidator
{
    public (bool IsValid, string Message) ValidateInvoice(InvoiceIssuanceDto dto)
    {
        if (dto.Customer == null)
            return (false, "Thông tin khách hàng không được để trống.");

        if (string.IsNullOrWhiteSpace(dto.Customer.TaxCode))
            return (false, "Mã số thuế khách hàng không được để trống.");

        if (dto.Products == null || !dto.Products.Any())
            return (false, "Hóa đơn phải có ít nhất một sản phẩm.");

        foreach (var p in dto.Products)
        {
            if (string.IsNullOrWhiteSpace(p.ItmName))
                return (false, "Tên sản phẩm không được để trống.");

            if (p.Qty <= 0)
                return (false, $"Sản phẩm '{p.ItmName}' có số lượng phải lớn hơn 0.");

            if (p.TotalAmt < 0)
                return (false, $"Sản phẩm '{p.ItmName}' có tổng tiền không được âm.");
        }

        decimal expectedTotal = dto.InvSubTotal + dto.InvVatAmount - dto.InvDiscAmount;

        if (Math.Abs(expectedTotal - dto.InvTotalAmount) > 2)
        {
            return (false, $"Tổng tiền hóa đơn ({dto.InvTotalAmount}) không khớp với chi tiết tính toán ({expectedTotal}).");
        }

        return (true, string.Empty);
    }
}