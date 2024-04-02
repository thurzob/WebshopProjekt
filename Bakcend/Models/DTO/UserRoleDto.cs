namespace Bakcend.Models.DTO
{
    public class UserRoleDto
    {
        public string UserId { get; set; }   
        public IEnumerable<string> Roles { get; set; }
    }
}
