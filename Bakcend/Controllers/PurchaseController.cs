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
    public class PurchaseController : ControllerBase
    {


        [HttpPost]
        public ActionResult Post(CreatePurchaseDto createPurchaseDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var purchase = new Purchase
            {
                BillingName = createPurchaseDto.BillingName,
                BillingPostalCode = createPurchaseDto.BillingPostalCode,
                BillingAddress = createPurchaseDto.BillingAddress,
                Email = createPurchaseDto.Email,
                PostalCode = createPurchaseDto.PostalCode,
                DeliveryAddress = createPurchaseDto.DeliveryAddress,
                PhoneNumber = createPurchaseDto.PhoneNumber,
                UserId = createPurchaseDto.UserId,
                Date = createPurchaseDto.Date,
                // További adatok beállítása...
            };

            // Regisztráció manuális hozzáadása
            using (var context = new WebshopContext())
            {
                if (purchase == null)
                {
                    return BadRequest();
                }
                else
                {
                    context.Add(purchase);
                    context.SaveChanges();
                    return Ok(purchase);
                }

            }
        }

    }


}
