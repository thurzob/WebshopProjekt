using Bakcend.Models.DTO;
using Bakcend.Service.IAuth;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Backend.Service;
using System.Net.Mail;
using System.Net;
using SendGrid.Helpers.Mail;
using SendGrid;
using Microsoft.EntityFrameworkCore;
using Bakcend.Data;
using Bakcend.Models;
using Microsoft.AspNetCore.Identity;
using Bakcend.Service;
using System.Net.Mail;
using System.Net;

namespace Auth.Controllers
{





    [Route("auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService authService;
        private readonly string gmailEmailAddress = "thurzobence98@gmail.com"; // Gmail címed
        private readonly string gmailEmailPassword = "uopd apeq etaa hihc"; // Gmail jelszavad
        
        public AuthController(IAuthService authService)
        {
            this.authService = authService;
        }
        

        // Replace MyContext with your actual DbContext class name




        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterRequestDto registerRequestDto)
        {
            var errorMessage = await authService.Register(registerRequestDto);

            if (!string.IsNullOrEmpty(errorMessage))
            {
                return StatusCode(400, errorMessage);
            }
            return StatusCode(201, "Sikeres regisztráció");
        }


        [HttpPost("AssignRole")]
        public async Task<ActionResult> AssignRole([FromBody] RoleDto model)
        {

            var assignRoleSuccesful = await authService.AssignRole(model.Email, model.Role.ToUpper());

            if (!assignRoleSuccesful)
            {
                return BadRequest();
            }


            return StatusCode(200, "Sikeres szerep létrehozás.");
        }

        [HttpPut("assignPutRole")]
        public async Task<IActionResult> AssignPutRole([FromBody] UserRolePutDto userRolePutDto)
        {
            var assignRoleSuccesful = await authService.AssignPutRole(userRolePutDto.UserId, userRolePutDto.NewRole);
            if (!assignRoleSuccesful)
            {
                return BadRequest();
            }


            return StatusCode(200, "Sikeres szerep változtatás.");
        }



        [HttpGet("GetRoles")]
        public async Task<ActionResult<IEnumerable<UserRoleDto>>> GetRoles()
        {
            var usersWithRoles = await authService.GetRolesForAllUsers();

            if (usersWithRoles == null || !usersWithRoles.Any())
            {
                return NotFound();
            }

            return Ok(usersWithRoles);
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginRequestDto model)
        {
            var loginResponse = await authService.Login(model);

            if (loginResponse == null || loginResponse.Token == null)
            {
                return BadRequest("Nem megfelelő felhasználónév vagy jelszó!");
            }

            // Token dekódolása és felhasználó azonosítójának kinyerése
            var jwtTokenDecoder = new JwtTokenDecoder();
            var userId = jwtTokenDecoder.GetUserIdFromToken(loginResponse.Token);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(); // Ha nem sikerült kinyerni a felhasználó azonosítóját a tokentől
            }

            // Visszaadjuk a token-t és a felhasználó azonosítóját (GUID)
            var loginResponseWithUserId = new LoginResponseDto
            {
                Token = loginResponse.Token,
                UserId = userId // Felhasználó GUID-ja
            };

            return StatusCode(200, loginResponseWithUserId);
        }

        [HttpPost("reset-password")]
        public async Task<ActionResult> ResetPasswordManually(PasswordResetRequestDto passwordResetRequestDto)
        {
            try
            {
                // Ellenőrizd, hogy az email cím nem üres
                if (string.IsNullOrEmpty(passwordResetRequestDto.Email))
                {
                    return StatusCode(400, "Az email cím nem lehet üres.");
                }

                // Jelszó frissítése az adatbázisban
                var passwordUpdated = await authService.ResetPassword(passwordResetRequestDto.Email);

                if (!passwordUpdated)
                {
                    return StatusCode(500, "Nem sikerült frissíteni az új jelszót az adatbázisban.");
                }

                // Jelszó generálása
                var newPassword = authService.GenerateRandomPassword();

                // Email küldése a visszaállított jelszóval
                using (var client = new SmtpClient("smtp.gmail.com", 587))
                {
                    client.EnableSsl = true;
                    client.Credentials = new NetworkCredential(gmailEmailAddress, gmailEmailPassword);

                    var mailMessage = new MailMessage();
                    mailMessage.From = new MailAddress(gmailEmailAddress);
                    mailMessage.To.Add(passwordResetRequestDto.Email);
                    mailMessage.Subject = "Jelszó visszaállítás";
                    mailMessage.Body = "Az új jelszavad: " + newPassword;

                    client.Send(mailMessage); 
                }

                return StatusCode(200, "Az új jelszó sikeresen frissítve az adatbázisban és elküldve az email címre.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Hiba történt az új jelszó mentése és az email küldése közben: {ex.Message}");
            }
        }
    }

}


    

