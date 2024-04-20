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
using System.Net.Mail;
using System.Net;


namespace Bakcend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PurchaseController : ControllerBase
    {
        private readonly string gmailEmailAddress = "thurzobence98@gmail.com";
        private readonly string gmailEmailPassword = "uopd apeq etaa hihc";
        [HttpPost]
        public async Task<ActionResult> Post(CreatePurchaseDto createPurchaseDto)
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
                    // Küldd el a megerősítő e-mailt a vásárlónak
                    var emailSent = await SendOrdersEmail(purchase.Email);
                    if (emailSent)
                    {
                        return Ok(purchase);
                    }
                    else
                    {
                        return StatusCode(500); // Internal Server Error, ha az e-mail küldése sikertelen
                    }
                }
            }
        }

        private async Task<bool> SendOrdersEmail(string emailAddress)
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
                    mailMessage.Subject = "Sikeres rendelés";
                    mailMessage.Body = "Kedves Felhasználó! Köszönjük a vásárlást, megrendelését elkezdtük összekészíteni. Megrendelésével kapcsolatos információkért elérhetőség: Tel.:+36/70 4212294 Email: thurzobence98@gmail.com";

                    await client.SendMailAsync(mailMessage);
                }

                return true; // Az e-mail küldése sikeres volt
            }
            catch
            {
                return false; // Az e-mail küldése sikertelen volt
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
