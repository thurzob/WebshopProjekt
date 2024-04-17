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
using System.Text;

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

            // Sikeres regisztráció esetén küldjünk egy megerősítő e-mailt
            try
            {
                var emailSent = await SendRegistrationConfirmationEmail(registerRequestDto.Email);
                if (!emailSent)
                {
                    // Ha nem sikerült elküldeni az e-mailt, akkor adjunk vissza egy hibaüzenetet
                    return StatusCode(500, "Nem sikerült elküldeni a megerősítő e-mailt.");
                }
            }
            catch (Exception ex)
            {
                // Ha valamilyen hiba történt az e-mail küldése közben, akkor adjunk vissza egy hibaüzenetet
                return StatusCode(500, $"Hiba történt az e-mail küldése közben: {ex.Message}");
            }

            return StatusCode(201, "Sikeres regisztráció");
        }

        private async Task<bool> SendRegistrationConfirmationEmail(string emailAddress)
        {
            try
            {
                using (var client = new SmtpClient("smtp.gmail.com", 587))
                {
                    client.EnableSsl = true;
                    client.Credentials = new NetworkCredential(gmailEmailAddress, gmailEmailPassword);

                    var mailMessage = new MailMessage();
                    mailMessage.From = new MailAddress(gmailEmailAddress);
                    mailMessage.To.Add(emailAddress);
                    mailMessage.Subject = "Sikeres regisztráció";
                    mailMessage.Body = "Kedves Felhasználó! Köszönjük a regisztrációt.";

                    await client.SendMailAsync(mailMessage);
                }

                return true; // Az e-mail küldése sikeres volt
            }
            catch
            {
                return false; // Az e-mail küldése sikertelen volt
            }
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

        private string HashPassword(string password)
        {
            using (var sha256 = System.Security.Cryptography.SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));

                // Convert the byte array to hexadecimal string
                var builder = new StringBuilder();
                for (int i = 0; i < hashedBytes.Length; i++)
                {
                    builder.Append(hashedBytes[i].ToString("x2"));
                }

                return builder.ToString();
            }
        }

        [HttpPost("reset-password")]
        public async Task<ActionResult> ResetPasswordManually(PasswordResetRequestDto passwordResetRequestDto)
        {
            try
            {
                // Új jelszó generálása
                var newPassword = authService.GenerateRandomPassword();

                // Jelszó frissítése az adatbázisban az új jelszóval
                var hashedNewPassword = HashPassword(newPassword);

                // Jelszó frissítése az adatbázisban az új jelszóval
                var passwordUpdated = await authService.ResetPassword(passwordResetRequestDto.Email, hashedNewPassword);
                if (!passwordUpdated)
                {
                    return StatusCode(500, "Nem sikerült frissíteni az új jelszót az adatbázisban.");
                }

                // Email küldése az új jelszóval
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

                return Ok(new { Message = "A jelszó sikeresen frissült és az új jelszó elküldve az email címre.", NewPassword = newPassword });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Hiba történt az új jelszó mentése és az email küldése közben: {ex.Message}");
            }

        }

        
    }

}


    

