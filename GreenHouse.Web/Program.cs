using GreenHouse.DataAccess;
using GreenHouse.DataAccess.Context;
using GreenHouse.DataAccess.UnitOfWork;
using GreenHouse.DomainEntity.Identity;
using GreenHouse.Services;
using GreenHouse.Web.Initializer;
using GreenHouse.Web.Library;
using IdentityModel;
using IdentityModel.Client;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using MZBase.Infrastructure;
using System.Globalization;
using System.Security.Authentication;

var builder = WebApplication.CreateBuilder(args);
var mvcBuilder = builder.Services.AddRazorPages();
int cookieLifeTimeMinutes = 120;

if (builder.Environment.IsDevelopment())
{
    //mvcBuilder.AddRazorRuntimeCompilation();
}

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(
    c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "FacilityMan.API.Web", Version = "v1" });
    }
    );
//var b = builder.Services.Configure<IdentityOptions>(options =>
//{
//    options.Password.RequireDigit = true;
//    options.Password.RequireUppercase = true;
//    options.Password.RequireLowercase = true; ;
//    options.Password.RequireNonAlphanumeric = true;
//    options.Password.RequiredUniqueChars = 1;
//    options.Password.RequiredLength = 8;

//    options.SignIn.RequireConfirmedPhoneNumber = false;
//    options.SignIn.RequireConfirmedEmail = false;



//    options.User.RequireUniqueEmail = true;

//})
//    .AddIdentityServer(options =>
//    {
//        options.Events.RaiseErrorEvents = true;
//        options.Events.RaiseInformationEvents = true;
//        options.Events.RaiseFailureEvents = true;
//        options.Events.RaiseSuccessEvents = true;
//        options.EmitStaticAudienceClaim = true;


//    });
//.AddInMemoryIdentityResources(SD.IdentityResources)
//.AddInMemoryApiScopes(SD.ApiScopes)
//.AddInMemoryClients(SDToBeChangeble)
//.AddAspNetIdentity<ApplicationUser>();
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

builder.Services.AddHttpClient();
builder.Services.AddHttpContextAccessor();

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;

    })
    .AddJwtBearer("Bearer", options =>
    {
        options.Authority = builder.Configuration["ServiceUrls:IdentityAPI"];
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateAudience = false,
            RoleClaimType = JwtClaimTypes.Role,
            NameClaimType = JwtClaimTypes.Name,
        };
        if (builder.Configuration.GetValue<bool>("ServerCertificateCustomValidationCallback"))
        {
            options.BackchannelHttpHandler =
            new HttpClientHandler { ServerCertificateCustomValidationCallback = delegate { return true; } };
        }

    })
   .AddCookie(options =>
   {
       options.Cookie.Name = "YourCookieName"; // Set your desired cookie name
       options.Cookie.HttpOnly = true;
       options.ExpireTimeSpan = TimeSpan.FromMinutes(30); // Set your desired expiration time
       options.LoginPath = "/Account/Login"; // Set the login path
                                             // Other options you might want to configure
   });
//.AddOpenIdConnect(OpenIdConnectDefaults.AuthenticationScheme, options =>
//{
//    //options.Authority = builder.Configuration["ServiceUrls:IdentityAPI"];
//    options.MetadataAddress = "https://localhost:7091/.well-known/openid-configuration";
//    options.GetClaimsFromUserInfoEndpoint = true;
//    options.ClientId = "facilityman";
//    options.ClientSecret = "74588342E9F149A3A2E887F0F09D86A9";
//    options.ResponseType = "code";
//    options.ClaimActions.MapJsonKey("role", "role", "role");
//    options.ClaimActions.MapJsonKey("sub", "sub", "sub");
//    options.ClaimActions.MapUniqueJsonKey("name", "name");
//    options.ClaimActions.MapUniqueJsonKey("given_name", "given_name");
//    options.ClaimActions.MapUniqueJsonKey("family_name", "family_name");
//    options.TokenValidationParameters.NameClaimType = "name";
//    options.TokenValidationParameters.RoleClaimType = "role";
//    options.Scope.Add("facilityman");
//    options.Scope.Add("IdentityServerApi");
//    options.SaveTokens = true;
//    //options.UseTokenLifetime = true;


//    if (builder.Configuration.GetValue<bool>("ServerCertificateCustomValidationCallback"))
//    {
//        options.BackchannelHttpHandler = new HttpClientHandler
//        {
//            SslProtocols = SslProtocols.Tls12 | SslProtocols.Tls11 | SslProtocols.Tls12 | SslProtocols.Tls13,
//            ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true
//        };
//    }

//    options.Events = new Microsoft.AspNetCore.Authentication.OpenIdConnect.OpenIdConnectEvents
//    {
//        OnAuthorizationCodeReceived = (context) =>
//        {
//            return System.Threading.Tasks.Task.CompletedTask;
//        },
//        OnTokenResponseReceived = (context) =>
//        {
//            return System.Threading.Tasks.Task.CompletedTask;
//        },

//        OnUserInformationReceived = (context) =>
//        {
//            return System.Threading.Tasks.Task.CompletedTask;
//        },
//        OnRemoteFailure = context =>
//        {
//            context.Response.Redirect("/");
//            context.HandleResponse();

//            return Task.FromResult(0);
//        },
//        OnRedirectToIdentityProvider = n => //token expired!
//        {
//            if (n.Request.Path.StartsWithSegments("/api"))
//            {
//                n.Response.StatusCode = 401;//for web api only!
//                n.Response.Headers.Remove("Set-Cookie");
//                n.Response.Headers.Add("login-address", n.Options.Authority + "/Account/Login");
//                n.HandleResponse();
//            }
//            return Task.CompletedTask;
//        },
//        OnAuthenticationFailed = n =>
//        {
//            return System.Threading.Tasks.Task.CompletedTask;
//        },
//        OnAccessDenied = n =>
//        {
//            return System.Threading.Tasks.Task.CompletedTask;
//        },


//    };

//});


builder.Services.ConfigureApplicationCookie(options =>
{
    options.ExpireTimeSpan = TimeSpan.FromMinutes(cookieLifeTimeMinutes);
    options.SlidingExpiration = true;
});
builder.Services.Configure<SecurityStampValidatorOptions>(options => options.ValidationInterval = TimeSpan.FromSeconds(180));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyHeader();
        policy.AllowAnyMethod();
        //policy.WithOrigins("*");
        policy.AllowCredentials();
    });
});

builder.Services.AddControllersWithViews(options =>
{
    options.Filters.Add<ServiceExceptionHandlerFilter>();
}
).AddNewtonsoftJson();

builder.Services.AddDbContext<CoreDbContext>();
builder.Services.AddDbContext<ApplicationDbContext>();
builder.Services.AddScoped<IDateTimeProviderService, DateTimeProviderService>();
builder.Services.AddScoped<ICoreUnitOfWork, CoreUnitOfWork>();
builder.Services.AddScoped<UserGreenhouseHallService, UserGreenhouseHallService>();
builder.Services.AddScoped<TemperatureSensorService, TemperatureSensorService>();
builder.Services.AddScoped<TemperatureSensorDetailService, TemperatureSensorDetailService>();

builder.Services.AddScoped<IDbInitializer, DbInitializer>();

builder.Services.AddIdentity<ApplicationUser, ApplicationRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();
//.AddErrorDescriber<PersianIdentityErrorDescriber>();
//b.AddDeveloperSigningCredential();
try
{
    var app = builder.Build();

    app.UseMiddleware<ErrorHandlerMiddleware>();
  
    using (var scope = app.Services.CreateScope())
    {
        var dataContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        dataContext.Database.Migrate();

        var f = scope.ServiceProvider.GetRequiredService<IDbInitializer>();
        f.Initialize();
    }
    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
        app.UseSwagger();
        app.UseSwaggerUI();
    }
    else
    {
        app.UseExceptionHandler("/Error");
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
    }

    app.UseHttpsRedirection();
    app.UseStaticFiles();
    app.UseRouting();
    app.UseCors();
    //app.UseEndpoints(endpoints =>
    //        {
    //            endpoints.MapFallbackToPage("/_Host");
    //            endpoints.MapRazorPages();
    //        });
    //app.UseIdentityServer();
    app.UseAuthentication();

    app.Use(async (httpContext, next) =>
    {
        var userName = "-";
        var client = "-";
        if (httpContext != null)
        {
            userName = httpContext.User.Identity.IsAuthenticated ? httpContext.User.Identity.Name : "anonymous"; //Gets user Name from user Identity  
            client = httpContext.Connection.RemoteIpAddress.ToString() ?? "unknown";
        }
        //LogContext.PushProperty("UserName", userName); //Push user in LogContext;  
        //LogContext.PushProperty("IP", client); //Push user in LogContext;  

        //await next.Invoke();
        try
        {

            await next.Invoke();
        }
        catch (Exception ex1)
        {

            throw ex1;

        }

    }
           );
    app.UseAuthorization();

    //app.MapControllerRoute(name: "workflow",
    //            pattern: "workflow/{*workflow-definitions}",
    //            defaults: new { controller = "workflow", action = "index" });

    //app.UseStaticFiles();

    app.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}");
    //app.UseSerilogRequestLogging();

    app.Run();
}
catch (Exception exception)
{
    //Log.Fatal(exception, "Failed to initialize HostBuilder");
}




