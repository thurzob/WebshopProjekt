using Bakcend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Bakcend.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        
        public AppDbContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<ApplicationUser> applicationUsers { get; set; } = null!;
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

         
        }
        public AppDbContext() 
        { }
    }
}
