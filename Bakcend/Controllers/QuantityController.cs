using Bakcend.Models.DTO;
using Bakcend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Bakcend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuantityController : ControllerBase
    {
        [HttpPost]
        public ActionResult Post(CreateQuantityDto createQuantityDto )
        {

            var quantity = new Quantity()
            {
                QuantityPurchased = createQuantityDto.QuantityPurchased,
                
            };

            using (var context = new WebshopContext())
            {
                if (quantity == null)
                {
                    return BadRequest();
                }
                else
                {
                    context.Add(quantity);
                    context.SaveChanges();
                    return StatusCode(201, "Sikeres hozzáadás");
                }

            }
        }

        [HttpGet]
        public ActionResult Get()
        {
            using (var context = new WebshopContext())
            {
                var quantity = context.Quantities.ToList();
                return StatusCode(200, quantity);
            }


        }

        [HttpGet("{id}")]
        public ActionResult Get(int id)
        {
            using (var context = new WebshopContext())
            {
                var quantity = context.Quantities.FirstOrDefault(quantity => quantity.Id == id);

                if (quantity == null)
                {
                    return NotFound();
                }

                return StatusCode(200, quantity);
            }
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            using (var context = new WebshopContext())
            {

                var quantity = context.Quantities.FirstOrDefault(quantity => quantity.Id == id);

                if (quantity != null)
                {
                    context.Quantities.Remove(quantity);
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
        public ActionResult Put(int id, UpdateQuantityDto updateQuantityDto)
        {
            using (var context = new WebshopContext())
            {
                var existingquantity = context.Quantities.FirstOrDefault(quantity => quantity.Id == id);

                if (existingquantity != null)
                {

                    existingquantity.QuantityPurchased = updateQuantityDto.QuantityPurchased;
                    

                    context.Quantities.Update(existingquantity);
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
