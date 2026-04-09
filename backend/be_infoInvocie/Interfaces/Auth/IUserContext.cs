namespace be_infoInvoice.Interfaces.Auth
{
    public interface IUserContext
    {
        int UserId { get; }
        int TaxId { get; }
        int ProviderId { get; }
    }
}
