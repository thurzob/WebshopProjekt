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
                Tidid = createPurchaseDto.Tidid,
                UserId = createPurchaseDto.UserId,
                Date = createPurchaseDto.Date,
                
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

        [HttpPut("{Id}")]
        public ActionResult Put(int Id, UpdatePurchaseDto updatePurchaseDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            using (var context = new WebshopContext())
            {
                var purchase = context.Purchases.FirstOrDefault(p => p.Id == updatePurchaseDto.Id);

                if (purchase == null)
                {
                    return NotFound();
                }

                purchase.Id = updatePurchaseDto.Id; 
                purchase.BillingName = updatePurchaseDto.BillingName;
                purchase.BillingPostalCode = updatePurchaseDto.BillingPostalCode;
                purchase.BillingAddress = updatePurchaseDto.BillingAddress;
                purchase.Email = updatePurchaseDto.Email;
                purchase.PostalCode = updatePurchaseDto.PostalCode;
                purchase.DeliveryAddress = updatePurchaseDto.DeliveryAddress;
                purchase.PhoneNumber = updatePurchaseDto.PhoneNumber;
                

                // További adatok frissítése...

                context.SaveChanges();

                // Visszaadjuk csak a módosított adatokat
                var updatedPurchaseDto = new UpdatedPurchaseDto
                {
                    Id = purchase.Id,
                    BillingName = purchase.BillingName,
                    BillingPostalCode = purchase.BillingPostalCode,
                    BillingAddress = purchase.BillingAddress,
                    Email = purchase.Email,
                    PostalCode = purchase.PostalCode,
                    DeliveryAddress = purchase.DeliveryAddress,
                    PhoneNumber = purchase.PhoneNumber,
                    
                };

                return Ok(updatedPurchaseDto);
            }
        }

    }


}
