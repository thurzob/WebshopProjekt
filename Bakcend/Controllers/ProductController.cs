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
    public class ProductController : ControllerBase
    {
        [HttpPost]
        public ActionResult Post(CreateProductDto createProductDto)
        {

            var product = new Product()
            {
                SerialName = createProductDto.SerialName,
                Type = createProductDto.Type,
                Price = createProductDto.Price,
               

            };

            using (var context = new WebshopContext())
            {
                if (product == null)
                {
                    return BadRequest();
                }
                else
                {
                    context.Add(product);
                    context.SaveChanges();
                    return StatusCode(201, "Sikeres hozzáadás");
                }

            }
        }

        [HttpGet("{id}")]
        public ActionResult Get(int id)
        {
            using (var context = new WebshopContext())
            {
                var product = context.Products.FirstOrDefault(product => product.Id == id);

                if (product == null)
                {
                    return NotFound();
                }

                return StatusCode(200, product);
            }

        }

        [HttpGet]
        public ActionResult Get()
        {
            using (var context = new WebshopContext())
            {
                var product = context.Products.ToList();
                return StatusCode(200, product);
            }

        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            using (var context = new WebshopContext())
            {

                var product = context.Products.FirstOrDefault(product => product.Id == id);

                if (product != null)
                {
                    context.Products.Remove(product);
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
        public ActionResult Put(int id, UpdateProductDto updateProductDto)
        {
            using (var context = new WebshopContext())
            {
                var existingproduct = context.Products.FirstOrDefault(product => product.Id == id);

                if (existingproduct != null)
                {

                    existingproduct.SerialName = existingproduct.SerialName;
                    existingproduct.Type = existingproduct.Type;
                    existingproduct.Price = existingproduct.Price;

                    context.Products.Update(existingproduct);
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
