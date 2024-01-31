using GreenHouse.DataAccess.Context;
using GreenHouse.DomainEntity.Identity;
using IdentityModel;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace GreenHouse.Web.Initializer
{
    public class DbInitializer : IDbInitializer
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly ApplicationDbContext _dbContext;

        public DbInitializer(ApplicationDbContext db, UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager, ApplicationDbContext dbContext)
        {

            _userManager = userManager;
            _roleManager = roleManager;
            _dbContext = dbContext;
        }
        public void Initialize()
        {
            if (_roleManager.FindByNameAsync(GlobalRoles.Admin).Result == null)
            {
                _roleManager.CreateAsync(new ApplicationRole(GlobalRoles.Admin)).GetAwaiter().GetResult();
                _roleManager.CreateAsync(new ApplicationRole(GlobalRoles.Customer)).GetAwaiter().GetResult();

            }
            else
            {

            }
        
            if (_userManager.FindByNameAsync("1234567890")?.Result == null)
            {
                ApplicationUser adminUser = new ApplicationUser()
                {
                    UserName = "1234567890",
                    Email = "admin1@gmail.com",
                    EmailConfirmed = true,
                    PhoneNumber = "91079127",
                    FirstName = "کاربر",
                    LastName = "مدیر سیستم",
                    IsActive = true
                };

                _userManager.CreateAsync(adminUser, "Admin123*").GetAwaiter().GetResult();
                _userManager.AddToRoleAsync(adminUser, GlobalRoles.Admin).GetAwaiter().GetResult();
                _userManager.AddClaimsAsync(adminUser, new Claim[]{
             new Claim(JwtClaimTypes.Name,adminUser.FirstName+" "+adminUser.LastName),
             new Claim(JwtClaimTypes.GivenName,adminUser.FirstName),
             new Claim(JwtClaimTypes.FamilyName,adminUser.LastName),
             new Claim(JwtClaimTypes.Role,GlobalRoles.Admin),
         }).GetAwaiter().GetResult();
            }

        }
    }

    internal class GlobalRoles
    {
        internal static readonly string Admin = "Admin";

        public static string Customer { get; internal set; } = "Customer";
    }
}