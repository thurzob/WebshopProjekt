using Bakcend.Models;

namespace Bakcend.Service.IAuth
{
    public interface IJwtTokenGenerator
    {
        string GenerateToken(ApplicationUser applicationUser, IEnumerable<string> roles);
    }
}
