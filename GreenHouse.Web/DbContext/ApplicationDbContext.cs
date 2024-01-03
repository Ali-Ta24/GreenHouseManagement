using GreenHouse.DomainEntitty.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
namespace GreenHouse.Web.DbContext
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
            this.ChangeTracker.LazyLoadingEnabled = false;
        }

        public ApplicationDbContext() : base()
        {
            this.ChangeTracker.LazyLoadingEnabled = false;
        }

        #region Query sets
        //public DbSet<ApplicatioUserViewEntity> ApplicatioUserViewEntities { get; set; }
        //public DbSet<UserDetailsViewEntity> UserDetailViewEntities { get; set; }
        //public DbSet<RolesViewEntity> RoleViewEntities { get; set; }
        //public DbSet<ProfileStaticDataEntity> ProfileStaticData { get; set; }
        //public DbSet<ProfilePictureUserEntity> ProfilePictureUser { get; set; }
        #endregion

        private static string getConnectionString()
        {
            var environmentName =
              Environment.GetEnvironmentVariable(
                  "ASPNETCORE_ENVIRONMENT");

            //Console.WriteLine("2");
            var config = new ConfigurationBuilder().AddJsonFile("appsettings" + (String.IsNullOrWhiteSpace(environmentName) ? "" : "." + environmentName) + ".json", false).Build();

            return config.GetConnectionString("DefaultConnection");
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //Console.WriteLine("4");
            optionsBuilder.UseSqlServer(getConnectionString());
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            //modelBuilder.ApplyConfiguration(new DepartmentConfiguration());
            //modelBuilder.Entity<ApplicatioUserViewEntity>().ToView("vw_ApplicationUser");
            //modelBuilder.Entity<RolesViewEntity>().ToView("vw_Roles");
            //modelBuilder.Entity<UserDetailsViewEntity>().ToView("vw_UserDetails");
            //modelBuilder.ApplyConfiguration(new ProfileStaticDataConfiguration());
        }
    }
}
