using GreenHouse.DataAccess.Context;
using GreenHouse.DomainEntitty.Identity;
using GreenHouse.Services;
using GreenHouse.Web.Controller.Model;
using GreenHouse.Web.IdentityServerHost;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        //private readonly IIdentityServerInteractionService _interaction;
        private readonly IAuthenticationSchemeProvider _schemeProvider;
        //private readonly IIdentityProviderStore _identityProviderStore;
        //private readonly IClientStore _clientStore;
        //private readonly IEventService _events;
        private readonly IConfiguration _configuration;
        private readonly UserGreenhouseHallService _service;
        private readonly ApplicationDbContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public AccountController(/*IIdentityServerInteractionService interaction,*/
            //IClientStore clientStore,
            IAuthenticationSchemeProvider schemeProvider,
            //IIdentityProviderStore identityProviderStore,
            //IEventService events,
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
            //_interaction = interaction;
                //_clientStore = clientStore;
            _schemeProvider = schemeProvider;
            //    _identityProviderStore = identityProviderStore;
            //_events = events;
            //    //_validatorService = validatorService;
            _dbContext = dbContext;
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
        }

        [Route("")]
        [Route("Login")]
        [Route("Account/Login/{returnUrl?}")]
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
                // we only have one option for logging in and it's an external provider
                return RedirectToAction("Challenge", "External", new { scheme = vm.ExternalLoginScheme, returnUrl });
            }
            //return View(new LoginViewModel());
            return View(vm);
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginInputModel model, string button)
        {
            if (model.NationalCodeId != null)
            {
                Regex n = new Regex("^[0-9]+$");
                if (!n.IsMatch(model.NationalCodeId))
                {
                    ModelState.AddModelError("NationalcodeId", "فقط استفاده از ارقام 0 - 9 برای کد ملی مجاز است");

                }
            }

            // check if we are in the context of an authorization request
            //var context = await _interaction.GetAuthorizationContextAsync(model.ReturnUrl);

            // the user clicked the "cancel" button
            if (button != "login")
            {
                //if (context != null)
                //{
                //    // if the user cancels, send a result back into IdentityServer as if they 
                //    // denied the consent (even if this client does not require consent).
                //    // this will send back an access denied OIDC error response to the client.
                //    //await _interaction.DenyAuthorizationAsync(context, AuthorizationError.AccessDenied);

                //    // we can trust model.ReturnUrl since GetAuthorizationContextAsync returned non-null
                //    //if (context.IsNativeClient())
                //    //{
                //    //    // The client is native, so this change in how to
                //    //    // return the response is for better UX for the end user.
                //    //    return this.LoadingPage("Redirect", model.ReturnUrl);
                //    //}

                //    return Redirect(model.ReturnUrl);
                //}
                //else
                //{
                //    // since we don't have a valid context, then we just go back to the home page
                    return Redirect("~/");
                //}
            }

            string NotActive = "";
            var user = await _dbContext.Users.Where(s => s.NationalCodeId == model.NationalCodeId).FirstOrDefaultAsync();
            if (user != null)
            {
                if (user.IsDeleted)
                {
                    NotActive = "نام کاربری یا رمز عبور نامعتبر است";
                    ModelState.AddModelError("", "نام کاربری یا رمز عبور نامعتبر است");

                    //LogContext.PushProperty("UserName", user.UserName);
                    //LogContext.PushProperty("EventId", "UserNotFound");

                    //await _events.RaiseAsync(new UserLoginFailureEvent(model.Username, "user not found", clientId: context?.Client.ClientId));

                    var vm1 = await BuildLoginViewModelAsync(model);
                    return View(vm1);
                }
                if (user.IsActive == false)
                {
                    NotActive = "حساب کاربری شما غیر فعال میباشد";
                    ModelState.AddModelError("", "حساب کاربری شما غیر فعال میباشد");

                    //LogContext.PushProperty("UserName", user.UserName);
                    //LogContext.PushProperty("EventId", "UserNotActive");

                    //await _events.RaiseAsync(new UserLoginFailureEvent(model.Username, "user not active", clientId: context?.Client.ClientId));

                    var vm1 = await BuildLoginViewModelAsync(model);
                    return View(vm1);
                }

            }

            if (user == null)
            {
                ModelState.AddModelError(string.Empty, "نام کاربری یا رمز عبور نامعتبر است" /*AccountOptions.InvalidCredentialsErrorMessage*/);
                NotActive += "نام کاربری یا رمز عبور نامعتبر است";

                //LogContext.PushProperty("UserName", model.NationalCodeId);
                //LogContext.PushProperty("EventId", "UserNotFoundInLogin");

                //await _events.RaiseAsync(new UserLoginFailureEvent(model.Username, "User not found", clientId: context?.Client.ClientId));

                var vm2 = await BuildLoginViewModelAsync(model);
                return View(vm2);
            }

            if (ModelState.IsValid)
            {
                try
                {
                    var result = await _signInManager.PasswordSignInAsync(user, model.Password, model.RememberLogin, lockoutOnFailure: false);
                    if (result.Succeeded)
                    {
                        //LogContext.PushProperty("UserName", user.UserName);
                        //LogContext.PushProperty("EventId", "UserLoginSuccess");
                        //var user = await _userManager.FindByNameAsync(model.Username);
                        //await _events.RaiseAsync(new UserLoginSuccessEvent(user.UserName, user.Id, user.UserName, clientId: context?.Client.ClientId));
                        //Log.Logger.Information("Successful login UserName{@UserName} ,EventId")

                        //if (context != null)
                        //{
                        //    return Redirect(model.ReturnUrl);
                        //}
                        if (Url.IsLocalUrl(model.ReturnUrl))
                        {
                            return Redirect(model.ReturnUrl);
                        }
                        else if (string.IsNullOrEmpty(model.ReturnUrl))
                        {
                            //return Redirect("~/");
                            return Redirect(_configuration.GetSection("UrlOtherApplication").GetSection("FacilityManWeb").Value);
                        }
                        else
                        {
                            throw new Exception("invalid return url");
                        }
                    }

                    //LogContext.PushProperty("UserName", user.UserName);
                    //LogContext.PushProperty("EventId", "UserLoginFail");
                    //await _events.RaiseAsync(new UserLoginFailureEvent(model.Username, "invalid credentials", clientId: context?.Client.ClientId));


                    ModelState.AddModelError("Password", "نام کاربری یا رمز عبور نامعتبر است" /*AccountOptions.InvalidCredentialsErrorMessage*/);
                    NotActive += "نام کاربری یا رمز عبور نامعتبر است";
                    var vm2 = await BuildLoginViewModelAsync(model);
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
        private async Task<LoginViewModel> BuildLoginViewModelAsync(LoginInputModel model)
        {
            var vm = await BuildLoginViewModelAsync(model.ReturnUrl);
            vm.Username = model.Username;
            vm.RememberLogin = model.RememberLogin;
            return vm;
        }
        private async Task<LoginViewModel> BuildLoginViewModelAsync(string returnUrl)
        {
            //var context = await _interaction.GetAuthorizationContextAsync(returnUrl);
            //if (context?.IdP != null && await _schemeProvider.GetSchemeAsync(context.IdP) != null)
            //{
            //    var local = context.IdP == Duende.IdentityServer.IdentityServerConstants.LocalIdentityProvider;

            //    // this is meant to short circuit the UI and only trigger the one external IdP
            //    var vm = new LoginViewModel
            //    {
            //        EnableLocalLogin = local,
            //        ReturnUrl = returnUrl,
            //        Username = context?.LoginHint,
            //    };

            //    if (!local)
            //    {
            //        vm.ExternalProviders = new[] { new ExternalProvider { AuthenticationScheme = context.IdP } };
            //    }

            //    return vm;
            //}

            var schemes = await _schemeProvider.GetAllSchemesAsync();

            var providers = schemes
                .Where(x => x.DisplayName != null)
                .Select(x => new ExternalProvider
                {
                    DisplayName = x.DisplayName ?? x.Name,
                    AuthenticationScheme = x.Name
                }).ToList();

            //var dyanmicSchemes = (await _identityProviderStore.GetAllSchemeNamesAsync())
            //    .Where(x => x.Enabled)
            //    .Select(x => new ExternalProvider
            //    {
            //        AuthenticationScheme = x.Scheme,
            //        DisplayName = x.DisplayName
            //    });
            //providers.AddRange(dyanmicSchemes);

            var allowLocal = true;
            //if (context?.Client.ClientId != null)
            //{
            //    var client = await _clientStore.FindEnabledClientByIdAsync(context.Client.ClientId);
            //    if (client != null)
            //    {
            //        allowLocal = client.EnableLocalLogin;

            //        if (client.IdentityProviderRestrictions != null && client.IdentityProviderRestrictions.Any())
            //        {
            //            providers = providers.Where(provider => client.IdentityProviderRestrictions.Contains(provider.AuthenticationScheme)).ToList();
            //        }
            //    }
            //}

            return new LoginViewModel
            {
                //AllowRememberLogin = AccountOptions.AllowRememberLogin,
                //EnableLocalLogin = allowLocal && AccountOptions.AllowLocalLogin,
                ReturnUrl = returnUrl,
                //Username = context?.LoginHint,
                ExternalProviders = providers.ToArray()
            };
        }
    }
}
