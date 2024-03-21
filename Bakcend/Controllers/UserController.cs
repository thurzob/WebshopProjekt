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


namespace Bakcend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        

        [HttpPost]
        public async Task<ActionResult> Register(CreateUserDto createUserDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new User
            {
                Name = createUserDto.Name,               
                Email = createUserDto.Email,
                PhoneNumber = createUserDto.PhoneNumber,           
                // További adatok beállítása...
            };

            // Regisztráció manuális hozzáadása
            using (var context = new WebshopContext())
            {
                context.Users.Add(user);
                await context.SaveChangesAsync();
            }

            return Ok(user);
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
        public ActionResult Delete(int id)
        {
            using (var context = new WebshopContext())
            {

                var user = context.Users.FirstOrDefault(user => user.Id == id);

                if (user != null)
                {
                    context.Users.Remove(user);
                    context.SaveChanges();

                    return StatusCode(200, "Sikeres törlés");
                }
                else
                {
                    return NotFound();
                }
            }
        }

        [HttpPut("{id}")]
        public ActionResult Put(int id, UpdateUserDto updateUserDto)
        {
            using (var context = new WebshopContext())
            {
                var existinguser = context.Users.FirstOrDefault(user => user.Id == id);

                if (existinguser != null)
                {

                    existinguser.Name = updateUserDto.Name;                   
                    existinguser.Email = updateUserDto.Email;
                    existinguser.PhoneNumber = updateUserDto.PhoneNumber;
                    

                    context.Users.Update(existinguser);
                    context.SaveChanges();

                    return StatusCode(200, "Sikeres frissítés!");
                }
                else
                {
                    return NotFound();
                }

            }
        }
    }


}
