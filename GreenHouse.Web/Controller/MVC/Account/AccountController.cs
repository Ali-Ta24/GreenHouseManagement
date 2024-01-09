﻿using GreenHouse.DataAccess.Context;
using GreenHouse.DomainEntitty.Identity;
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
            if (model.UserName != null)
            {
                Regex n = new Regex("^[0-9]+$");
                if (!n.IsMatch(model.UserName))
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
            var user = await _dbContext.Users.Where(s => s.UserName == model.UserName).FirstOrDefaultAsync();
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

                //LogContext.PushProperty("UserName", model.UserName);
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
                    //return View(nameof(Register), new RegisterViewModel());
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
                    UserName = model.Username,
                    EmailConfirmed = true,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    PhoneNumber = model.PhoneNumber,
                    PhoneNumberConfirmed = false,
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

                    await _dbContext.Database.CreateExecutionStrategy().Execute(async () =>
                    {
                        using (var transaction = this._dbContext.Database.BeginTransaction())
                        {
                            try
                            {
                                //randomNumber = RandomFunc();

                                //_dbContext.Add(new OneTimePassword
                                //{
                                //    UserId = idOfAddedUser,
                                //    Password = randomNumber,
                                //    Action = nameof(Register),
                                //    ExpireDate = DateTime.Now.AddMinutes(2).AddSeconds(10)
                                //});
                                await this._dbContext.SaveChangesAsync();

                                //await SendEmail(new TUser { Email = model.Email }, randomNumber);

                                if (randomNumber != null)
                                {
                                    transaction.Commit();

                                }
                            }
                            catch (Exception e)
                            {
                                transaction.Rollback();
                            }
                        }
                    });
                    //var resultsentSms = await _smtpService.SendSmsAsync($"رمز یک بار مصرف شما برای ثبت نام در سیستم {randomNumber} میباشد", model.PhoneNumber);

                    //if (!resultsentSms)
                    //{
                    //    _dbContext.Users.Remove(addedUser);
                    //    await _dbContext.SaveChangesAsync();
                    //    ModelState.AddModelError("", "ارسال رمز یک بار مصرف به موبایل شما با موفقیت انجام نشد , لطفا لحظاتی دیگر مجددا تلاش کنید");
                    //    return View(nameof(Register), new RegisterViewModel());
                    //}

                    var x = new RegisterOtpViewModel()
                    {
                        //OneTimePassword = randomNumber,
                        //UserId = idOfAddedUser,
                        //Password = model.Password,
                        ReturnUrl = returnUrl
                    };

                    return RedirectToAction("ConfirmRegister", x);
                }
                foreach (var item in result.Errors)
                {
                    ModelState.AddModelError("Password", item.Description);
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        [HttpGet]
        public async Task<IActionResult> ConfirmRegister(RegisterOtpViewModel model)
        {

            if (TempData.ContainsKey("ConfirmYourPhoneNumber"))
            {
                string? x = TempData["ConfirmYourPhoneNumber"].ToString();
                ViewBag.ConfirmYourPhoneNumber = x;
            }
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ConfirmRegister(RegisterOtpViewModel model, string? returnUrl = null)
        {

            var addedUser = _dbContext.Users.Where(ss => ss.Id == model.UserId).FirstOrDefault();
            //var addedClaimUser = _dbContext.UserClaims.Where(ss => ss.UserId == model.UserId).FirstOrDefault();
            try
            {
                ViewData["ReturnUrl"] = returnUrl;

                //var password = new OneTimePassword();

                //Check onetime password for {ConfirmPhonenUmber and Register}
                //password = await _dbContext.oneTimePasswords.AsNoTracking()
                //                   .Where(w => w.Password == model.OneTimePassword
                //                   && w.ExpireDate > DateTime.Now && w.UserId == model.UserId && w.Action == "Register")
                //                   .FirstOrDefaultAsync();

                //if (password != null)
                //{
                //وقتی که رمز درست بود ان را از جدول حذف میکنیم
                //_dbContext.Remove(password);
                await _dbContext.SaveChangesAsync();


                //سپس ادامه فرایند لاگین
                //var context = await _interaction.GetAuthorizationContextAsync(model?.ReturnUrl);
                var user = new ApplicationUser { UserName = addedUser.Email, Email = addedUser.Email };
                await _signInManager.SignInAsync(addedUser, false);


                var checkuser = await _userManager.FindByEmailAsync(addedUser.Email);
                //await _events.RaiseAsync(new UserLoginSuccessEvent(checkuser.UserName, checkuser.Id, checkuser.FirstName, clientId: context?.Client.ClientId));

                //تایید شماره همراه کاربر برای ورود به سیستم
                addedUser.PhoneNumberConfirmed = true;
                await _dbContext.SaveChangesAsync();

                //if (context != null)
                //{
                //    if (context.IsNativeClient())
                //    {
                //        // The client is native, so this change in how to
                //        // return the response is for better UX for the end user.
                //        return this.LoadingPage("Redirect", model.ReturnUrl);
                //    }

                //    // we can trust model.ReturnUrl since GetAuthorizationContextAsync returned non-null
                //    return Redirect(model.ReturnUrl);
                //}

                // request for a local page
                if (Url.IsLocalUrl(model.ReturnUrl))
                {
                    return Redirect(model.ReturnUrl);
                }
                else if (string.IsNullOrEmpty(model.ReturnUrl))
                {
                    var redirectUrl = _configuration.GetSection("UrlOtherApplication").GetSection("FacilityManWeb").Value;
                    return Redirect(redirectUrl);
                }
                else
                {
                    // user might have clicked on a malicious link - should be logged
                    throw new Exception("invalid return URL");
                }
                //}
                ModelState.AddModelError("", "خطایی در درخواست شما رخ داده است");
                return View(model);
                //}

                ModelState.AddModelError("", "رمز عبور وارد شده یا اشتباه است یا زمان آن منقضی شده است");
                return View(model);
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("OnetimePassword", "خطایی در درخواست شما رخ داده است");
                return View(model);

            }

        }
        private async Task<RegisterViewModel> BuildRegisterViewModelAsync(string? returnUrl)
        {
            //var context = await _interaction.GetAuthorizationContextAsync(returnUrl);
            List<string> roles = new List<string>();
            roles.Add("Admin");
            roles.Add("Customer");
            ViewBag.message = roles;
            //if (context?.IdP != null && await _schemeProvider.GetSchemeAsync(context.IdP) != null)
            //{
            //    var local = context.IdP == Duende.IdentityServer.IdentityServerConstants.LocalIdentityProvider;

            //    // this is meant to short circuit the UI and only trigger the one external IdP
            //    var vm = new RegisterViewModel
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

            var allowLocal = true;
            //if (context?.Client.ClientId != null)
            //{
            //    //var client = await _clientStore.FindEnabledClientByIdAsync(context.Client.ClientId);
            //    if (client != null)
            //    {
            //        allowLocal = client.EnableLocalLogin;

            //        if (client.IdentityProviderRestrictions != null && client.IdentityProviderRestrictions.Any())
            //        {
            //            providers = providers.Where(provider => client.IdentityProviderRestrictions.Contains(provider.AuthenticationScheme)).ToList();
            //        }
            //    }
            //}

            return new RegisterViewModel
            {
                //AllowRememberLogin = AccountOptions.AllowRememberLogin,
                //EnableLocalLogin = allowLocal && AccountOptions.AllowLocalLogin,
                ReturnUrl = returnUrl,
                //Username = context?.LoginHint,
                //ExternalProviders = providers.ToArray()
            };
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
