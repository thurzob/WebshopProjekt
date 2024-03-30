using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Bakcend.Models;
using Bakcend.Models.DTO;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using Bakcend.Service.IAuth;
using Bakcend.Service;
using Bakcend.Data;
using System;
using System.Text;
using System.Security.Cryptography;


namespace Bakcend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        [HttpPost]
        public ActionResult Post(CreateUserDto createUserDto)
        {

            var newUser = new Aspnetuser()
            {
                Id = Guid.NewGuid().ToString(),
                FullName = createUserDto.FullName,
                UserName = createUserDto.UserName,
                Email = createUserDto.Email,
                Age = createUserDto.Age,
                PasswordHash = HashPassword(createUserDto.PasswordHash),              
                PhoneNumber = createUserDto.PhoneNumber,


            };

            using (var context = new WebshopContext())
            {
                if (newUser == null)
                {
                    return BadRequest();
                }
                else
                {
                    context.Add(newUser);
                    context.SaveChanges();
                    return Ok(newUser);
                }

            }
        }



        [HttpGet("{id}")]
        public ActionResult Get(int id)
        {
            using (var context = new WebshopContext())
            {
                var user = context.Users.FirstOrDefault(x => x.Id == id);

                var result = context.Merchants.
                       Include(x => x.User).
                       Select(x => new { x.User, x.Id, x.SerialName, x.Type, x.Price, x.Quantity }).
                       Where(x => x.Id == id).ToList();

                if (result.Count != 0)
                {
                    return StatusCode(200, result);
                }

                if (user == null)
                {
                    return NotFound();
                }

                return StatusCode(200, user);


            }

        }

        [HttpGet]
        public ActionResult GetUserWithMerchantAndPurchase()
        {
            using (var context = new WebshopContext())
            {
                var usersWithMerchantsAndPurchases = context.Aspnetusers
                    .Include(u => u.Merchants)
                    .Include(u => u.Purchases) // Hozzáadva a vásárlások lekérdezéséhez
                    .ToList();

                if (usersWithMerchantsAndPurchases != null && usersWithMerchantsAndPurchases.Any())
                {
                    var userDtos = new List<UserDto>();

                    foreach (var userWithMerchantAndPurchase in usersWithMerchantsAndPurchases)
                    {
                        var userDto = new UserDto
                        {
                            Id = userWithMerchantAndPurchase.Id,
                            FullName = userWithMerchantAndPurchase.FullName,
                            Age = userWithMerchantAndPurchase.Age,
                            UserName = userWithMerchantAndPurchase.UserName,
                            Email = userWithMerchantAndPurchase.Email,
                            PasswordHash = userWithMerchantAndPurchase.PasswordHash,
                            PhoneNumber = userWithMerchantAndPurchase.PhoneNumber,
                            // Itt töltsd ki a többi felhasználóhoz tartozó adatot
                            // ...

                            // Merchant adatok
                                                 
                            MerchantType = userWithMerchantAndPurchase.Merchants?.FirstOrDefault()?.Type,
                            MerchantSerialName = userWithMerchantAndPurchase.Merchants?.FirstOrDefault()?.SerialName,
                            MerchantPrice = (int)(userWithMerchantAndPurchase.Merchants?.FirstOrDefault()?.Price ?? 0),
                            MerchantQuantity = (int)(userWithMerchantAndPurchase.Merchants?.FirstOrDefault()?.Quantity ?? 0),
                            MerchantProductId = (int)(userWithMerchantAndPurchase.Merchants?.FirstOrDefault()?.ProductId ?? 0),

                            // Itt töltsd ki a többi merchant adatot
                            // ...

                            // Purchase adatok
                            PurchaseBillingName = userWithMerchantAndPurchase.Purchases?.FirstOrDefault()?.BillingName,
                            PurchaseBillingAddress = userWithMerchantAndPurchase.Purchases?.FirstOrDefault()?.BillingAddress,
                            PurchaseEmail = userWithMerchantAndPurchase.Purchases?.FirstOrDefault()?.Email,
                            PurchasePostalCode = userWithMerchantAndPurchase.Purchases?.FirstOrDefault()?.PostalCode,
                            PurchaseBillingPostalCode = userWithMerchantAndPurchase.Purchases?.FirstOrDefault()?.BillingPostalCode,
                            PurchasaeDeliveryAddress = userWithMerchantAndPurchase.Purchases?.FirstOrDefault()?.DeliveryAddress,
                            PurchasePhoneNumber = userWithMerchantAndPurchase.Purchases?.FirstOrDefault()?.PhoneNumber,
                            PurchaseDate = userWithMerchantAndPurchase.Purchases?.FirstOrDefault()?.Date ?? DateTime.MinValue,


                            // Itt töltsd ki a többi purchase adatot
                            // ...
                        };

                        userDtos.Add(userDto);
                    }

                    return Ok(userDtos); // Visszaadása a lekérdezett felhasználók adatainak és a hozzájuk tartozó Merchant és Purchase adatoknak
                }
                else
                {
                    return NotFound(); // Ha nem található felhasználó, visszaadunk egy NotFound választ
                }
            }
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(string id)
        {
            using (var context = new WebshopContext())
            {

                var user = context.Aspnetusers.FirstOrDefault(user => user.Id == id);

                if (user != null)
                {
                    context.Aspnetusers.Remove(user);
                    context.SaveChanges();

                    return StatusCode(200, "Sikeres törlés");
                }
                else
                {
                    return NotFound();
                }
            }
        }
        [HttpPatch("{id}")]
        public ActionResult Patch(string id, UpdateUserDto updateUserDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            using (var context = new WebshopContext())
            {
                var existingUser = context.Aspnetusers.FirstOrDefault(aspnetuser => aspnetuser.Id == id);

                if (existingUser != null)
                {
                    // Csak a módosítandó mezőket frissítjük
                    if (updateUserDto.FullName != null)
                        existingUser.FullName = updateUserDto.FullName;

                    if (updateUserDto.UserName != null)
                        existingUser.UserName = updateUserDto.UserName;

                    if (updateUserDto.Email != null)
                        existingUser.Email = updateUserDto.Email;

                    if (updateUserDto.Age != null)
                        existingUser.Age = updateUserDto.Age;

                    if (updateUserDto.PhoneNumber != null)
                        existingUser.PhoneNumber = updateUserDto.PhoneNumber;

                    // Ha a jelszó meg van adva a CreateUserDto-ban, akkor hasheljük azt
                    if (updateUserDto.PasswordHash != null)
                    {
                        // Hasheljük a jelszót, mielőtt elmentenénk
                        existingUser.PasswordHash = HashPassword(updateUserDto.PasswordHash);
                    }

                    // További mezők frissítése...

                    // Az adatbázisban való frissítés tranzakcióban
                    using (var transaction = context.Database.BeginTransaction())
                    {
                        try
                        {
                            context.SaveChanges();
                            transaction.Commit();
                            return Ok(new
                            {
                                Message = "Sikeres frissítés!",
                                UpdatedFields = new
                                {
                                    FullName = existingUser.FullName,
                                    UserName = existingUser.UserName,
                                    Email = existingUser.Email,
                                    Age = existingUser.Age,
                                    PhoneNumber = existingUser.PhoneNumber,
                                    PasswordHash = existingUser.PasswordHash
                                }
                            });
                        }
                        catch (Exception)
                        {
                            transaction.Rollback();
                            return StatusCode(500, new { Message = "Hiba történt a frissítés közben." });
                        }
                    }
                }
                else
                {
                    return NotFound();
                }
            }
        }

        // Jelszó hashelése
        private string HashPassword(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                // Convert the input string to a byte array and compute the hash.
                byte[] data = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));

                // Create a new StringBuilder to collect the bytes and create a string.
                StringBuilder stringBuilder = new StringBuilder();

                // Loop through each byte of the hashed data and format each one as a hexadecimal string.
                for (int i = 0; i < data.Length; i++)
                {
                    stringBuilder.Append(data[i].ToString("x2"));
                }

                // Return the hexadecimal string.
                return stringBuilder.ToString();
            }
        }
    }


}
