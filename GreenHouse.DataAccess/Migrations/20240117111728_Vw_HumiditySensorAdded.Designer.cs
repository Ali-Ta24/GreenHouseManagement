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
    [Migration("20240117111728_Vw_HumiditySensorAdded")]
    partial class Vw_HumiditySensorAdded
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.14")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("GreenHouse.DomainEntity.HumiditySensorDetailEntity", b =>
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

            modelBuilder.Entity("GreenHouse.DomainEntity.HumiditySensorEntity", b =>
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

            modelBuilder.Entity("GreenHouse.DomainEntity.Identity.ApplicationUser", b =>
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

            modelBuilder.Entity("GreenHouse.DomainEntity.LightIntensitySensorDetailEntity", b =>
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

                    b.Property<int>("LightIntensitySensorID")
                        .HasColumnType("int");

                    b.Property<float>("LightIntensitySensorValue")
                        .HasColumnType("real");

                    b.HasKey("ID");

                    b.HasIndex("LightIntensitySensorID");

                    b.ToTable("LightIntensitySensorDetail");
                });

            modelBuilder.Entity("GreenHouse.DomainEntity.LightIntensitySensorEntity", b =>
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

                    b.Property<string>("LightIntensitySensorName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("ID");

                    b.HasIndex("GreenhouseHallID");

                    b.ToTable("LightIntensitySensor");
                });

            modelBuilder.Entity("GreenHouse.DomainEntity.TemperatureSensorDetailEntity", b =>
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

            modelBuilder.Entity("GreenHouse.DomainEntity.TemperatureSensorEntity", b =>
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

            modelBuilder.Entity("GreenHouse.DomainEntity.UserGreenhouseHallEntity", b =>
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

            modelBuilder.Entity("GreenHouse.DomainEntity.Views.HumiditySensorViewEntity", b =>
                {
                    b.Property<string>("CreatedBy")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreationTime")
                        .HasColumnType("datetime2");

                    b.Property<int>("GreenhouseHallID")
                        .HasColumnType("int");

                    b.Property<string>("HallName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("HumiditySensorName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("ID")
                        .HasColumnType("int");

                    b.Property<DateTime>("LastModificationTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("LastModifiedBy")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.ToTable((string)null);

                    b.ToView("Vw_HumiditySensor", (string)null);
                });

            modelBuilder.Entity("GreenHouse.DomainEntity.Views.TemperatureSensorViewEntity", b =>
                {
                    b.Property<string>("CreatedBy")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreationTime")
                        .HasColumnType("datetime2");

                    b.Property<int>("GreenhouseHallID")
                        .HasColumnType("int");

                    b.Property<string>("HallName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("ID")
                        .HasColumnType("int");

                    b.Property<DateTime>("LastModificationTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("LastModifiedBy")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("TemperatureSensorName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.ToTable((string)null);

                    b.ToView("Vw_TemperatureSensor", (string)null);
                });

            modelBuilder.Entity("GreenHouse.DomainEntity.HumiditySensorDetailEntity", b =>
                {
                    b.HasOne("GreenHouse.DomainEntity.HumiditySensorEntity", "HumiditySensorEntity")
                        .WithMany()
                        .HasForeignKey("HumiditySensorID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("HumiditySensorEntity");
                });

            modelBuilder.Entity("GreenHouse.DomainEntity.HumiditySensorEntity", b =>
                {
                    b.HasOne("GreenHouse.DomainEntity.UserGreenhouseHallEntity", "UserGreenhouseHall")
                        .WithMany()
                        .HasForeignKey("GreenhouseHallID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("UserGreenhouseHall");
                });

            modelBuilder.Entity("GreenHouse.DomainEntity.LightIntensitySensorDetailEntity", b =>
                {
                    b.HasOne("GreenHouse.DomainEntity.LightIntensitySensorEntity", "LightIntensitySensorEntity")
                        .WithMany()
                        .HasForeignKey("LightIntensitySensorID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("LightIntensitySensorEntity");
                });

            modelBuilder.Entity("GreenHouse.DomainEntity.LightIntensitySensorEntity", b =>
                {
                    b.HasOne("GreenHouse.DomainEntity.UserGreenhouseHallEntity", "UserGreenhouseHall")
                        .WithMany()
                        .HasForeignKey("GreenhouseHallID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("UserGreenhouseHall");
                });

            modelBuilder.Entity("GreenHouse.DomainEntity.TemperatureSensorDetailEntity", b =>
                {
                    b.HasOne("GreenHouse.DomainEntity.TemperatureSensorEntity", "TemperatureSensorEntity")
                        .WithMany()
                        .HasForeignKey("TemperatureSensorID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("TemperatureSensorEntity");
                });

            modelBuilder.Entity("GreenHouse.DomainEntity.TemperatureSensorEntity", b =>
                {
                    b.HasOne("GreenHouse.DomainEntity.UserGreenhouseHallEntity", "UserGreenhouseHall")
                        .WithMany()
                        .HasForeignKey("GreenhouseHallID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("UserGreenhouseHall");
                });

            modelBuilder.Entity("GreenHouse.DomainEntity.UserGreenhouseHallEntity", b =>
                {
                    b.HasOne("GreenHouse.DomainEntity.Identity.ApplicationUser", "ApplicationUser")
                        .WithMany()
                        .HasForeignKey("UserID");

                    b.Navigation("ApplicationUser");
                });
#pragma warning restore 612, 618
        }
    }
}
