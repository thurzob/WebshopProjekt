using Bakcend.Models.DTO;


namespace Bakcend.Service.IAuth
{
    public interface IAuthService
    {
        Task<string> Register(RegisterRequestDto registerRequestDto);
        Task<bool> AssignRole(string email, string roleName);
        Task<bool> AssignPutRole(string userid, string newRole);
        Task<IEnumerable<UserRoleDto>> GetRolesForAllUsers();
        Task<LoginResponseDto> Login(LoginRequestDto loginRequestDto);

        Task<bool> ResetPassword(string email, string newPassword);
        string GenerateRandomPassword();
    }
}
