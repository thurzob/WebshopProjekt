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
                OrderStatus = createUserDto.OrderStatus,
                


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

        [HttpPost("{id}/CreateOrderStatus")]
            public ActionResult CreateOrderStatus(string id, [FromBody] CreateOrderStatusDto createOrderStatusDto)
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
                        // Létrehozzuk az új OrderStatus rekordot és hozzáadjuk a felhasználóhoz
                        existingUser.OrderStatus = createOrderStatusDto.OrderStatus;

                        try
                        {
                            context.SaveChanges();
                            return Ok(new
                            {
                                Message = "Sikeresen létrehozva az OrderStatus!",
                                CreatedOrderStatus = existingUser.OrderStatus
                            });
                        }
                        catch (Exception)
                        {
                            return StatusCode(500, new { Message = "Hiba történt a létrehozás közben." });
                        }
                    }
                    else
                    {
                        return NotFound();
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
                    .Include(u => u.Purchases) 
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
                            OrderStatus = userWithMerchantAndPurchase.OrderStatus,

                            Merchants = userWithMerchantAndPurchase.Merchants.Select(m => new MerchantDto
                            {
                                Id = m.Id,
                                Type = m.Type,
                                SerialName = m.SerialName,
                                Price = (int)m.Price,
                                Quantity = (int)m.Quantity,
                                ProductId = (int)m.ProductId,
                                
                            }).ToList(),
                            

                            Purchases = userWithMerchantAndPurchase.Purchases.Select(p => new PurchaseDto
                            {
                                PurchaseId = p.Id,
                                PurchaseBillingName = p.BillingName,
                                PurchaseBillingAddress = p.BillingAddress,
                                PurchaseEmail = p.Email,
                                PurchasePostalCode = p.PostalCode,
                                PurchaseBillingPostalCode = p.BillingPostalCode,
                                PurchasaeDeliveryAddress = p.DeliveryAddress,
                                PurchasePhoneNumber = p.PhoneNumber,
                                PurchaseDate = p.Date,
                                TID = p.Tidid
                                
                                
                            }).ToList()


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

        [HttpPut]
        public ActionResult Put(string id, UpdateStatusDto updateStatusDto)
        {
            using (var context = new WebshopContext())
            {
                var existingOrderStatus = context.Aspnetusers.FirstOrDefault(aspnetuser => aspnetuser.Id == id);

                if (existingOrderStatus != null)
                {
                    existingOrderStatus.OrderStatus = updateStatusDto.OrderStatus;

                    context.Aspnetusers.Update(existingOrderStatus);
                    context.SaveChanges();

                    return Ok(200);
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
                    
                    if (updateUserDto.PasswordHash != null)
                    {
                        existingUser.PasswordHash = HashPassword(updateUserDto.PasswordHash);
                    }

                    

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
