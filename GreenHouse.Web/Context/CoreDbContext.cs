using GreenHouse.DomainEntitty;
using GreenHouse.DomainEntitty.Identity;
using Microsoft.EntityFrameworkCore;
namespace GreenHouse.Web.Context
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

            //modelBuilder.Entity<UserGreenhouseHallEntity>().HasOne(table => new ApplicationUser()
            //{

            //});
        }

        public DbSet<UserGreenhouseHallEntity> UserGreenhouseHall { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(getConnectionString());
        }
        private static string getConnectionString()
        {
            var environmentName =
              Environment.GetEnvironmentVariable(
                  "ASPNETCORE_ENVIRONMENT");

            var config = new ConfigurationBuilder().AddJsonFile("appsettings" + (String.IsNullOrWhiteSpace(environmentName) ? "" : "." + environmentName) + ".json", false).Build();


            return config.GetConnectionString("DefaultConnection");
        }
    }
}
