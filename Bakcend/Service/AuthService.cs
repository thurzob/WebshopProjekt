using Bakcend.Data;
using Bakcend.Models;
using Bakcend.Models.DTO;
using Bakcend.Service.IAuth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SendGrid.Helpers.Mail;

namespace Bakcend.Service
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext appDbContext;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;

        private readonly IJwtTokenGenerator jwtTokenGenerator;

        public AuthService(AppDbContext appDbContext, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IJwtTokenGenerator jwtTokenGenerator)
        {
            this.appDbContext = appDbContext;
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.jwtTokenGenerator = jwtTokenGenerator;
            
        }

        public async Task<bool> AssignRole(string email, string roleName)
        {
            var user = appDbContext.applicationUsers.FirstOrDefault(user => user.Email.ToLower() == email.ToLower());

            if (user != null)
            {
                if (!roleManager.RoleExistsAsync(roleName).GetAwaiter().GetResult())
                {
                    //Itt készülnek a Role-ok
                    roleManager.CreateAsync(new IdentityRole(roleName)).GetAwaiter().GetResult();
                }
                await userManager.UpdateSecurityStampAsync(user);
                await userManager.AddToRoleAsync(user, roleName);

                return true;
            }

            return false;

        }

        public async Task<bool> AssignPutRole(string userId, string newRole)
        {
            // Felhasználó keresése az azonosító alapján
            var user = await userManager.FindByIdAsync(userId);

            if (user != null)
            {
                // Ellenőrizze, hogy a szerep létezik-e, ha nem, akkor létrehozza
                if (!await roleManager.RoleExistsAsync(newRole))
                {
                    await roleManager.CreateAsync(new IdentityRole(newRole));
                }

                // Felhasználó szerepeinek frissítése
                var currentRoles = await userManager.GetRolesAsync(user);
                await userManager.RemoveFromRolesAsync(user, currentRoles.ToArray());
                await userManager.AddToRoleAsync(user, newRole);

                return true; // Sikeres frissítés esetén
            }

            return false; // Ha a felhasználó nem található
        }






        public async Task<IEnumerable<UserRoleDto>> GetRolesForAllUsers()
        {
            var usersWithRoles = new List<UserRoleDto>();

            var users = await userManager.Users.ToListAsync();

            foreach (var user in users)
            {
                var roles = await userManager.GetRolesAsync(user);
                var userWithRoles = new UserRoleDto
                {
                    UserId = user.Id,
                    Roles = roles.ToList()
                };
                usersWithRoles.Add(userWithRoles);
            }

            return usersWithRoles;
        }


        public async Task<LoginResponseDto> Login(LoginRequestDto loginRequestDto)
        {
            var user = await appDbContext.applicationUsers.
                FirstOrDefaultAsync(user => user.Email.ToLower() == loginRequestDto.Email.ToLower());

            bool isValid = await userManager.CheckPasswordAsync(user, loginRequestDto.Password);

            if (user == null || isValid == false)
            {
                return new LoginResponseDto() { Token = "Hibás Felhasználónév vagy jelszó!" };
            }

            var roles = await userManager.GetRolesAsync(user);
            var token = jwtTokenGenerator.GenerateToken(user, roles);

            await userManager.SetAuthenticationTokenAsync(user, "MyApp", "access_token", token);

            LoginResponseDto loginResponseDto = new()
            {
                Token = token
            };

            return loginResponseDto;


        }

        public async Task<string> Register(RegisterRequestDto registerRequestDto)
        {
            ApplicationUser user = new()
            {
                UserName = registerRequestDto.UserName,
                NormalizedUserName = registerRequestDto.UserName.ToUpper(),
                Email = registerRequestDto.Email,
                FullName = registerRequestDto.Fullname,
                PhoneNumber = registerRequestDto.PhoneNumber,
                Age = registerRequestDto.Age,
            };

            try
            {
                var result = await userManager.CreateAsync(user, registerRequestDto.Password);

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, "user");

                    var userToReturn = appDbContext.applicationUsers.First(user => user.UserName == registerRequestDto.UserName);

                    RegisterResponseDto registerResponseDto = new()
                    {
                        UserName = userToReturn.UserName,
                        Email = userToReturn.Email,
                        Fullname = userToReturn.FullName
                    };

                    return "";
                }
                else
                {
                    return result.Errors.FirstOrDefault().Description;
                }


            }
            catch (Exception)
            {

                throw;
            }


        }

        public async Task<bool> ResetPassword(string email)
        {
            var user = await appDbContext.applicationUsers.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());

            if (user != null)
            {
                // Új jelszó generálása
                var newPassword = GenerateRandomPassword();

                // Felhasználó jelszavának frissítése az új jelszóra
                user.PasswordHash = newPassword;

                // Az új jelszó beállítása a felhasználóhoz
                var result = await userManager.UpdateAsync(user);

                if (result.Succeeded)
                {
                    return true;
                }
            }

            return false;
        }

        // Jelszó generálása
        public string GenerateRandomPassword()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            Random random = new Random();
            return new string(Enumerable.Repeat(chars, 6) // 6 karakter hosszú jelszó
                .Select(s => s[random.Next(s.Length)])
                .ToArray());
        }
    }
}
