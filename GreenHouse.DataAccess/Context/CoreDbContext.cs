using GreenHouse.DomainEntity;
using GreenHouse.DomainEntity.Views;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
namespace GreenHouse.DataAccess.Context
{
    public class CoreDbContext : DbContext
    {
        public CoreDbContext(DbContextOptions<CoreDbContext> options) : base(options)
        {
            this.ChangeTracker.LazyLoadingEnabled = false;
        }
        public CoreDbContext() : base()
        {
            this.ChangeTracker.LazyLoadingEnabled = false;

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<TemperatureSensorViewEntity>().ToView("Vw_TemperatureSensor");
            modelBuilder.Entity<HumiditySensorViewEntity>().ToView("Vw_HumiditySensor");

        }

        public DbSet<UserGreenhouseHallEntity> UserGreenhouseHall { get; set; }
        public DbSet<TemperatureSensorEntity> TemperatureSensor { get; set; }
        public DbSet<TemperatureSensorDetailEntity> TemperatureSensorDetail { get; set; }
        public DbSet<HumiditySensorEntity> HumiditySensor { get; set; }
        public DbSet<HumiditySensorDetailEntity> HumiditySensorDetail { get; set; }
        public DbSet<LightIntensitySensorEntity> LightIntensitySensor { get; set; }
        public DbSet<LightIntensitySensorDetailEntity> LightIntensitySensorDetail { get; set; }


        public DbSet<TemperatureSensorViewEntity> TemperatureSensorView { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(getConnectionString());
        }
        private static string getConnectionString()
        {
            var environmentName =
              Environment.GetEnvironmentVariable(
                  "ASPNETCORE_ENVIRONMENT");

            var config = new ConfigurationBuilder().AddJsonFile("appsettings" + (string.IsNullOrWhiteSpace(environmentName) ? "" : "." + environmentName) + ".json", false).Build();


            return config.GetConnectionString("DefaultConnection");
        }
    }
}
