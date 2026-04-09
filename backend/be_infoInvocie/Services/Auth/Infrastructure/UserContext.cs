using be_infoInvoice.Interfaces.Auth;
using System.Security.Claims;

namespace be_infoInvoice.Services.Auth.Infrastructure
{
    public class UserContext(IHttpContextAccessor httpContextAccessor) : IUserContext
    {
        public int SessionId { 
            get
            {
                var value = httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                        ?? httpContextAccessor.HttpContext?.User?.FindFirst("sub")?.Value;
                return int.TryParse(value, out int id) ? id : 0;
            }

        }
    }
}
