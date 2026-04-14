
using be_infoInvoice.Core.DTOs;

namespace be_infoInvoice.Interfaces.Invoice.Validators;

public interface IInvoiceValidator
{
    (bool IsValid, string Message) ValidateInvoice(InvoiceAddDto dto);
}


