using Bakcend.Data;
using Bakcend.Models;
using Bakcend.Models.DTO;
using Bakcend.Service.IAuth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SendGrid.Helpers.Mail;
using System.Security.Cryptography;
using System.Text;

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
            var user = await appDbContext.applicationUsers
                .FirstOrDefaultAsync(user => user.Email.ToLower() == loginRequestDto.Email.ToLower());

            if (user == null)
            {
                return new LoginResponseDto() { Token = "Hibás Felhasználónév vagy jelszó!" };
            }

            // Jelszó hash-elése a bejelentkezési kérésben megadott jelszónak
            var passwordHasher = new PasswordHasher<ApplicationUser>();
            var hashedPassword = passwordHasher.HashPassword(user, loginRequestDto.Password);

            // Az adatbázisban tárolt hashelt jelszó lekérése
            var storedHashedPassword = user.PasswordHash;

            // Jelszó hash-elt értékeinek összehasonlítása
            bool isValidPassword = passwordHasher.VerifyHashedPassword(user, storedHashedPassword, loginRequestDto.Password) == PasswordVerificationResult.Success;

            if (!isValidPassword)
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



        public async Task<(bool, string)> ResetPassword(string email, string newPassword)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user == null)
            {
                // Felhasználó nem található az adott email címmel
                return (false, null);
            }

            // Jelszó generálása
            string generatedPassword = GenerateRandomPassword();

            // Jelszó hash-elése PBKDF2 algoritmussal
            var passwordHasher = new PasswordHasher<ApplicationUser>();
            var passwordHash = passwordHasher.HashPassword(user, generatedPassword);

            // Az új jelszó hash beállítása a felhasználóhoz
            user.PasswordHash = passwordHash;

            // Az új jelszó beállítása a felhasználóhoz
            var result = await userManager.UpdateAsync(user);

            return (result.Succeeded, generatedPassword);
        }

        public string GenerateRandomPassword()
        {
            const string validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            StringBuilder sb = new StringBuilder();
            Random random = new Random();
            for (int i = 0; i < 12; i++)
            {
                sb.Append(validChars[random.Next(validChars.Length)]);
            }
            return sb.ToString();
        }
    }
}
