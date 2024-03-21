using Bakcend.Models.DTO;


namespace Bakcend.Service.IAuth
{
    public interface IAuthService
    {
        Task<string> Register(RegisterRequestDto registerRequestDto);
        Task<bool> AssignRole(string email, string roleName);
        Task<LoginResponseDto> Login(LoginRequestDto loginRequestDto);

        Task<bool> ResetPassword(string email);
        string GenerateRandomPassword();
    }
}
