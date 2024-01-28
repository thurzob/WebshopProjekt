using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace Bakcend.Models;

public partial class WebshopContext : DbContext
{
    public WebshopContext()
    {
    }

    public WebshopContext(DbContextOptions<WebshopContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Merchant> Merchants { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<Quantity> Quantities { get; set; }

    public virtual DbSet<Storage> Storages { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=localhost;database=webshop;user=root;sslmode=none", Microsoft.EntityFrameworkCore.ServerVersion.Parse("10.4.32-mariadb"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_general_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Merchant>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("merchant");

            entity.HasIndex(e => e.QuantityId, "QuantityId");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.Price).HasColumnType("int(50)");
            entity.Property(e => e.QuantityId).HasColumnType("int(100)");
            entity.Property(e => e.SerialName).HasMaxLength(200);
            entity.Property(e => e.Type).HasMaxLength(200);

            entity.HasOne(d => d.Quantity).WithMany(p => p.Merchant)
                .HasForeignKey(d => d.QuantityId)
                .HasConstraintName("merchant_ibfk_2");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("order");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.Orders).HasColumnType("int(20)");
        });

        modelBuilder.Entity<Quantity>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("quantity");

            entity.Property(e => e.Id).HasColumnType("int(100)");
            entity.Property(e => e.QuantityPurchased)
                .HasColumnType("int(100)")
                .HasColumnName("quantityPurchased");
        });

        modelBuilder.Entity<Storage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("storage");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.Existing).HasColumnType("int(20)");
            entity.Property(e => e.Sold).HasColumnType("int(20)");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("user");

            entity.HasIndex(e => e.MerchantId, "MerchantsId");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.Email).HasMaxLength(200);
            entity.Property(e => e.MerchantId).HasColumnType("int(11)");
            entity.Property(e => e.Name).HasMaxLength(200);
            entity.Property(e => e.Password).HasMaxLength(200);
            entity.Property(e => e.PhoneNumber).HasColumnType("int(11)");

            entity.HasOne(d => d.Merchant).WithMany(p => p.User)
                .HasForeignKey(d => d.MerchantId)
                .HasConstraintName("user_ibfk_1");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
