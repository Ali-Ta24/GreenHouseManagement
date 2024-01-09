﻿// <auto-generated />
using System;
using GreenHouse.DataAccess.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace GreenHouse.DataAccess.Migrations
{
    [DbContext(typeof(CoreDbContext))]
    [Migration("20240109114149_CreateHumiditySensorDetailTable")]
    partial class CreateHumiditySensorDetailTable
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.14")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("GreenHouse.DomainEntitty.HumiditySensorDetailEntity", b =>
                {
                    b.Property<long>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasColumnOrder(0);

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("ID"));

                    b.Property<int>("HumiditySensorID")
                        .HasColumnType("int");

                    b.Property<float>("HumiditySensorValue")
                        .HasColumnType("real");

                    b.Property<DateTime>("LastModificationTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("LastModifiedBy")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("ID");

                    b.HasIndex("HumiditySensorID");

                    b.ToTable("HumiditySensorDetail");
                });

            modelBuilder.Entity("GreenHouse.DomainEntitty.HumiditySensorEntity", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnOrder(0);

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ID"));

                    b.Property<string>("CreatedBy")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnOrder(100);

                    b.Property<DateTime>("CreationTime")
                        .HasColumnType("datetime2")
                        .HasColumnOrder(102);

                    b.Property<int>("GreenhouseHallID")
                        .HasColumnType("int");

                    b.Property<string>("HumiditySensorName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("LastModificationTime")
                        .HasColumnType("datetime2")
                        .HasColumnOrder(103);

                    b.Property<string>("LastModifiedBy")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnOrder(101);

                    b.HasKey("ID");

                    b.HasIndex("GreenhouseHallID");

                    b.ToTable("HumiditySensor");
                });

            modelBuilder.Entity("GreenHouse.DomainEntitty.Identity.ApplicationUser", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("int");

                    b.Property<string>("ConcurrencyStamp")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsActive")
                        .HasColumnType("bit");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("bit");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("bit");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("NormalizedEmail")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("NormalizedUserName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("bit");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasMaxLength(25)
                        .HasColumnType("nvarchar(25)");

                    b.HasKey("Id");

                    b.ToTable("ApplicationUser");
                });

            modelBuilder.Entity("GreenHouse.DomainEntitty.TemperatureSensorDetailEntity", b =>
                {
                    b.Property<long>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasColumnOrder(0);

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("ID"));

                    b.Property<DateTime>("LastModificationTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("LastModifiedBy")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("TemperatureSensorID")
                        .HasColumnType("int");

                    b.Property<float>("TemperatureValue")
                        .HasColumnType("real");

                    b.HasKey("ID");

                    b.HasIndex("TemperatureSensorID");

                    b.ToTable("TemperatureSensorDetail");
                });

            modelBuilder.Entity("GreenHouse.DomainEntitty.TemperatureSensorEntity", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnOrder(0);

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ID"));

                    b.Property<string>("CreatedBy")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnOrder(100);

                    b.Property<DateTime>("CreationTime")
                        .HasColumnType("datetime2")
                        .HasColumnOrder(102);

                    b.Property<int>("GreenhouseHallID")
                        .HasColumnType("int");

                    b.Property<DateTime>("LastModificationTime")
                        .HasColumnType("datetime2")
                        .HasColumnOrder(103);

                    b.Property<string>("LastModifiedBy")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnOrder(101);

                    b.Property<string>("TemperatureSensorName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("ID");

                    b.HasIndex("GreenhouseHallID");

                    b.ToTable("TemperatureSensor");
                });

            modelBuilder.Entity("GreenHouse.DomainEntitty.UserGreenhouseHallEntity", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnOrder(0);

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ID"));

                    b.Property<string>("CreatedBy")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnOrder(100);

                    b.Property<DateTime>("CreationTime")
                        .HasColumnType("datetime2")
                        .HasColumnOrder(102);

                    b.Property<string>("HallName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("LastModificationTime")
                        .HasColumnType("datetime2")
                        .HasColumnOrder(103);

                    b.Property<string>("LastModifiedBy")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnOrder(101);

                    b.Property<string>("UserID")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("ID");

                    b.HasIndex("UserID");

                    b.ToTable("UserGreenhouseHall");
                });

            modelBuilder.Entity("GreenHouse.DomainEntitty.HumiditySensorDetailEntity", b =>
                {
                    b.HasOne("GreenHouse.DomainEntitty.HumiditySensorEntity", "HumiditySensorEntity")
                        .WithMany()
                        .HasForeignKey("HumiditySensorID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("HumiditySensorEntity");
                });

            modelBuilder.Entity("GreenHouse.DomainEntitty.HumiditySensorEntity", b =>
                {
                    b.HasOne("GreenHouse.DomainEntitty.UserGreenhouseHallEntity", "UserGreenhouseHall")
                        .WithMany()
                        .HasForeignKey("GreenhouseHallID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("UserGreenhouseHall");
                });

            modelBuilder.Entity("GreenHouse.DomainEntitty.TemperatureSensorDetailEntity", b =>
                {
                    b.HasOne("GreenHouse.DomainEntitty.TemperatureSensorEntity", "TemperatureSensorEntity")
                        .WithMany()
                        .HasForeignKey("TemperatureSensorID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("TemperatureSensorEntity");
                });

            modelBuilder.Entity("GreenHouse.DomainEntitty.TemperatureSensorEntity", b =>
                {
                    b.HasOne("GreenHouse.DomainEntitty.UserGreenhouseHallEntity", "UserGreenhouseHall")
                        .WithMany()
                        .HasForeignKey("GreenhouseHallID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("UserGreenhouseHall");
                });

            modelBuilder.Entity("GreenHouse.DomainEntitty.UserGreenhouseHallEntity", b =>
                {
                    b.HasOne("GreenHouse.DomainEntitty.Identity.ApplicationUser", "ApplicationUser")
                        .WithMany()
                        .HasForeignKey("UserID");

                    b.Navigation("ApplicationUser");
                });
#pragma warning restore 612, 618
        }
    }
}
