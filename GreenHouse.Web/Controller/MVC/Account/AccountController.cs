using Duende.IdentityServer.Extensions;
using GreenHouse.DataAccess.Context;
using GreenHouse.DomainEntity.Identity;
using GreenHouse.Services;
using GreenHouse.Web.Controller.Model;
using GreenHouse.Web.IdentityServerHost;
using IdentityModel;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace GreenHouse.Web.Controller.MVC.Account
{
    [SecurityHeaders]
    [AllowAnonymous]
    public class AccountController : Microsoft.AspNetCore.Mvc.Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<ApplicationRole> _roleManager;

        private readonly IAuthenticationSchemeProvider _schemeProvider;
        private readonly IConfiguration _configuration;
        private readonly UserGreenhouseHallService _service;
        private readonly ApplicationDbContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public AccountController(IAuthenticationSchemeProvider schemeProvider,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            RoleManager<ApplicationRole> roleManager,
            ApplicationDbContext dbContext,
            IHttpContextAccessor httpContextAccessor,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _schemeProvider = schemeProvider;
            _dbContext = dbContext;
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<IActionResult> Login(string? returnUrl)
        {
            if (TempData.ContainsKey("ResetSuccessFull"))
            {
                string? x = TempData["ResetSuccessFull"].ToString();
                ViewBag.ResetSuccessFull = x;
            }
            var vm = await BuildLoginViewModelAsync(returnUrl);
            vm.EnableLocalLogin = true;
            if (vm.IsExternalLoginOnly)
            {
                return RedirectToAction("Challenge", "External", new { scheme = vm.ExternalLoginScheme, returnUrl });
            }
            return View(vm);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginInputModel model, string button)
        {
            model.ReturnUrl = "~/";
            if (model.UserName != null)
            {
                Regex n = new Regex("^[0-9]+$");
                if (!n.IsMatch(model.UserName))
                {

                }
            }

            if (button != "login")
            {
                return Redirect("~/");
            }

            string NotActive = "";
            var user = await _dbContext.Users.Where(s => s.UserName == model.UserName).FirstOrDefaultAsync();
            if (user != null)
            {
                if (user.IsDeleted)
                {
                    NotActive = "نام کاربری یا رمز عبور نامعتبر است";
                    ModelState.AddModelError("", "نام کاربری یا رمز عبور نامعتبر است");

                    var vm1 = await BuildLoginViewModelAsync(model);
                    vm1.ReturnUrl = "~/";
                    return View(vm1);
                }
                if (user.IsActive == false)
                {
                    NotActive = "حساب کاربری شما غیر فعال میباشد";
                    ModelState.AddModelError("", "حساب کاربری شما غیر فعال میباشد");

                    var vm1 = await BuildLoginViewModelAsync(model);
                    vm1.ReturnUrl = "~/";
                    return View(vm1);
                }

            }

            if (user == null)
            {
                ModelState.AddModelError(string.Empty, "نام کاربری یا رمز عبور نامعتبر است");
                NotActive += "نام کاربری یا رمز عبور نامعتبر است";

                var vm2 = await BuildLoginViewModelAsync(model);
                vm2.ReturnUrl = "~/";
                return View(vm2);
            }

            if (ModelState.IsValid)
            {
                try
                {
                    var result = await _signInManager.PasswordSignInAsync(user, model.Password, model.RememberLogin, lockoutOnFailure: false);
                    if (result.Succeeded)
                    {
                        if (Url.IsLocalUrl(model.ReturnUrl))
                        {
                            return Redirect("~/");
                        }
                    }

                    ModelState.AddModelError("Password", "نام کاربری یا رمز عبور نامعتبر است");
                    NotActive += "نام کاربری یا رمز عبور نامعتبر است";
                    var vm2 = await BuildLoginViewModelAsync(model);
                    vm2.ReturnUrl = "~/";
                    return View(vm2);
                }
                catch (Exception e)
                {
                    throw e;
                }

            }

            var vm = await BuildLoginViewModelAsync(model);
            return View(vm);
        }

        [HttpGet]
        public async Task<IActionResult> Register(string? returnUrl)
        {
            // build a model so we know what to show on the reg page
            var vm = await BuildRegisterViewModelAsync(returnUrl);

            return View(vm);
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterViewModel model, string? returnUrl = null)
        {
            model.RoleName = "Customer";
            List<string> errors = new List<string>();

            if (model.PhoneNumber != null)
            {
                var checkPhone = await _dbContext.Users.Where(s => s.PhoneNumber == model.PhoneNumber).FirstOrDefaultAsync();

                if (checkPhone != null)
                {
                    ModelState.AddModelError("PhoneNumber", "شماره موبایل وارد شده قبلا در سیستم ثبت نام کرده است");
                    errors.Add("شماره موبایل وارد شده قبلا در سیستم ثبت نام کرده است");
                }
            }

            if (model.UserName != null)
            {
                var checkPhone = await _dbContext.Users.Where(s => s.UserName == model.UserName).FirstOrDefaultAsync();

                if (checkPhone != null)
                {
                    ModelState.AddModelError("UserName", "این نام کاربری در سیستم موجود است");
                    errors.Add("نام کاربری تکراری میباشد");
                }
            }

            if (errors.Any())
            {
                return View(nameof(Register), new RegisterViewModel());
            }

            ViewData["ReturnUrl"] = returnUrl;
            if (ModelState.IsValid)
            {
                var user = new ApplicationUser
                {
                    UserName = model.UserName,
                    EmailConfirmed = true,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    PhoneNumber = model.PhoneNumber,
                    PhoneNumberConfirmed = true,
                    IsActive = true,
                    IsDeleted = false
                };

                var result = await _userManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    if (!_roleManager.RoleExistsAsync(model.RoleName).GetAwaiter().GetResult())
                    {
                        var userRole = new ApplicationRole
                        {
                            Name = model.RoleName,
                            NormalizedName = model.RoleName,

                        };
                        await _roleManager.CreateAsync(userRole);
                    }

                    await _userManager.AddToRoleAsync(user, model.RoleName);

                    await _userManager.AddClaimsAsync(user, new Claim[]
                    {
                            new Claim(JwtClaimTypes.Name, model.FirstName+" "+model.LastName),
                            new Claim(JwtClaimTypes.FamilyName, model.LastName),
                            new Claim(JwtClaimTypes.GivenName, model.FirstName),
                            new Claim(JwtClaimTypes.WebSite, "http://"+user.UserName+".com"),
                            new Claim(JwtClaimTypes.Role,"Customer"),
                    });


                    string randomNumber = "";

                    var x = new RegisterOtpViewModel()
                    {
                        UserId = model.UserName,
                        ReturnUrl = returnUrl
                    };

                    return Redirect("~/");
                }
                foreach (var item in result.Errors)
                {
                    ModelState.AddModelError("Password", item.Description);
                }
            }

            return View(model);
        }

        /// <summary>
        /// Show logout page
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> Logout(string logoutId)
        {
            // build a model so the logout page knows what to display
            var vm = await BuildLogoutViewModelAsync(logoutId);

            if (vm.ShowLogoutPrompt == false)
            {

                return await Logout(vm);
            }

            return View(vm);
        }

        /// <summary>
        /// Handle logout page postback
        /// </summary>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout(LogoutInputModel model)
        {
            // build a model so the logged out page knows what to display
            var vm = await BuildLoggedOutViewModelAsync(model.LogoutId);

            if (User?.Identity.IsAuthenticated == true)
            {
                await _signInManager.SignOutAsync();
            }

            if (vm.TriggerExternalSignout)
            {
                string url = Url.Action("Logout", new { logoutId = vm.LogoutId });

                return SignOut(new AuthenticationProperties { RedirectUri = url }, vm.ExternalAuthenticationScheme);
            }
            return RedirectToAction(nameof(Login));
        }

        private async Task<LoggedOutViewModel> BuildLoggedOutViewModelAsync(string logoutId)
        {
            var vm = new LoggedOutViewModel
            {
                AutomaticRedirectAfterSignOut = AccountOptions.AutomaticRedirectAfterSignOut,
                LogoutId = logoutId
            };

            if (User?.Identity.IsAuthenticated == true)
            {
                var idp = User.FindFirst(JwtClaimTypes.IdentityProvider)?.Value;
                if (idp != null && idp != Duende.IdentityServer.IdentityServerConstants.LocalIdentityProvider)
                {
                    var providerSupportsSignout = await HttpContext.GetSchemeSupportsSignOutAsync(idp);
                    if (providerSupportsSignout)
                    {
                        vm.ExternalAuthenticationScheme = idp;
                    }
                }
            }

            return vm;
        }

        private async Task<RegisterViewModel> BuildRegisterViewModelAsync(string? returnUrl)
        {
            List<string> roles = new List<string>();
            roles.Add("Admin");
            roles.Add("Customer");
            ViewBag.message = roles;

            var schemes = await _schemeProvider.GetAllSchemesAsync();

            var providers = schemes
                .Where(x => x.DisplayName != null)
                .Select(x => new ExternalProvider
                {
                    DisplayName = x.DisplayName ?? x.Name,
                    AuthenticationScheme = x.Name
                }).ToList();

            var allowLocal = true;

            return new RegisterViewModel
            {
                ReturnUrl = returnUrl,
            };
        }
        private async Task<LoginViewModel> BuildLoginViewModelAsync(LoginInputModel model)
        {
            var vm = await BuildLoginViewModelAsync(model.ReturnUrl);
            vm.Username = model.Username;
            vm.RememberLogin = model.RememberLogin;
            return vm;
        }
        private async Task<LogoutViewModel> BuildLogoutViewModelAsync(string logoutId)
        {
            var vm = new LogoutViewModel { LogoutId = logoutId, ShowLogoutPrompt = AccountOptions.ShowLogoutPrompt };

            if (User?.Identity.IsAuthenticated != true)
            {
                vm.ShowLogoutPrompt = false;
                return vm;
            }

            return vm;
        }
        private async Task<LoginViewModel> BuildLoginViewModelAsync(string returnUrl)
        {
            var schemes = await _schemeProvider.GetAllSchemesAsync();

            var providers = schemes
                .Where(x => x.DisplayName != null)
                .Select(x => new ExternalProvider
                {
                    DisplayName = x.DisplayName ?? x.Name,
                    AuthenticationScheme = x.Name
                }).ToList();

            var allowLocal = true;

            return new LoginViewModel
            {
                ReturnUrl = returnUrl,
                ExternalProviders = providers.ToArray()
            };
        }
    }
}
