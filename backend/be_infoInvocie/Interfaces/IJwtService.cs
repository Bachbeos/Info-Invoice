namespace be_infoInvoice.Interfaces;

public interface IJwtService
{
    string GenerateToken(int sessionId);
}
