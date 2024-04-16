using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Bakcend.Models;
using Bakcend.Models.DTO;
using Microsoft.EntityFrameworkCore;
using System.Collections.Immutable;

namespace Bakcend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MerchantController : ControllerBase
    {
        [HttpPost]
        public ActionResult Post(CreateMerchantDto createMerchantDto)
        {
            var merchant = new Merchant()
            {
                UserId = createMerchantDto.UserId,
                SerialName = createMerchantDto.SerialName,
                Type = createMerchantDto.Type,
                Price = createMerchantDto.Price,
                ProductId = createMerchantDto.ProductId,
                Quantity = createMerchantDto.Quantity,
            };

            using (var context = new WebshopContext())
            {
                if (merchant == null)
                {
                    return BadRequest();
                }
                else
                {
                    context.Add(merchant);
                    context.SaveChanges();

                    

                    

                    
                    return Ok(merchant.Id);
                }
            }
        }

        [HttpGet("{id}")]
        public ActionResult Get(int id)
        {
            using (var context = new WebshopContext())
            {
                var merchant = context.Merchants.FirstOrDefault(x => x.Id == id);

                if (merchant == null)
                {
                    return NotFound();
                }

                return Ok(merchant);
            }
        }

        [HttpGet]
        public ActionResult Get()
        {
            using (var context = new WebshopContext())
            {
                var merchants = context.Merchants.ToList();

                if (merchants == null || merchants.Count == 0)
                {
                    return NotFound();
                }

                return Ok(merchants);
            }
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            using (var context = new WebshopContext())
            {

                var merchant = context.Merchants.FirstOrDefault(merchant => merchant.Id == id);

                if (merchant != null)
                {
                    context.Merchants.Remove(merchant);
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
        public ActionResult Put(int id, UpdateMerchantDto updateMerchantDto)
        {
            using (var context = new WebshopContext())
            {
                var existingmerchant = context.Merchants.FirstOrDefault(merchant => merchant.Id == id);

                if (existingmerchant != null)
                {

                    existingmerchant.SerialName = existingmerchant.SerialName;
                    existingmerchant.Type = existingmerchant.Type;
                    existingmerchant.Quantity = existingmerchant.Quantity;
                    existingmerchant.Price = existingmerchant.Price;
                    

                    context.Merchants.Update(existingmerchant);
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
