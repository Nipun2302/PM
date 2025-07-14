using Microsoft.EntityFrameworkCore;
using PM.server.Model;
using System.Collections.Generic;

namespace PM.server.Data
{
    public class ProductDbContext(DbContextOptions<ProductDbContext> options) : DbContext(options)

    {
        public DbSet<User> Users => Set<User>();
        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasPrecision(18, 2); // Fixes the warning for decimal precision


            base.OnModelCreating(modelBuilder);
        }
    }
}
