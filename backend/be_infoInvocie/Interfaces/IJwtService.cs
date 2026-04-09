namespace be_infoInvoice.Interfaces;

public interface IJwtService
{
    string GenerateToken(int userId, int taxId, int providerId);
}
