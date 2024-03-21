using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;

namespace Backend.Service
{
    public class JwtTokenDecoder
    {
        public string GetUserIdFromToken(string token)
        {
            try
            {
                var jwtHandler = new JwtSecurityTokenHandler();
                var jwtToken = jwtHandler.ReadToken(token) as JwtSecurityToken;

                if (jwtToken == null)
                {
                    throw new ArgumentException("Invalid token.");
                }

                // A felhasználó GUID-ját tartalmazó claim neve
                var userIdClaimName = "sub"; // Az Ön esetében ez lehet más, attól függően, hogy a GUID-ot melyik claim-nek feleltette meg a token kibocsátója

                // Az adott claim értéke (felhasználó GUID-ja)
                var userId = jwtToken.Claims.FirstOrDefault(c => c.Type == userIdClaimName)?.Value;

                return userId;
            }
            catch (Exception ex)
            {
                // Kezelje a dekódolási hibát itt
                Console.WriteLine($"Error decoding token: {ex.Message}");
                return null;
            }
        }
    }
}