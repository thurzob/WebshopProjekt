using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Bakcend.Models;
using Bakcend.Models.DTO;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;


namespace Bakcend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        [HttpPost]
        public ActionResult Post(CreateUserDto createUserDto)
        {

            var user = new User()
            {
                Name = createUserDto.Name,
                Password = createUserDto.Password,
                Email = createUserDto.Email,
                PhoneNumber = createUserDto.PhoneNumber,
                Date = createUserDto.Date,
                
                
            };

            using (var context = new WebshopContext())
            {
                if (user == null)
                {
                    return BadRequest();
                }
                else
                {
                    context.Add(user);
                    context.SaveChanges();
                    return Ok(user);
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
        public ActionResult Get()
        {
            using (var context = new WebshopContext())
            {
                var user = context.Users.FirstOrDefault();

                var result = context.Merchants.
                       Include(x => x.User).
                       Select(x => new { x.User, x.Id, x.SerialName, x.Type, x.Price, x.Quantity })
                       .ToList();

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
                    existinguser.Password = updateUserDto.Password;
                    existinguser.Email = updateUserDto.Email;
                    existinguser.PhoneNumber = updateUserDto.PhoneNumber;
                    existinguser.Date = updateUserDto.Date;

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
