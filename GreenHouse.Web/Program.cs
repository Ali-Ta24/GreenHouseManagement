using GreenHouse.DataAccess.Context;
using GreenHouse.DataAccess.UnitOfWork;
using GreenHouse.DomainEntity.Identity;
using GreenHouse.Services;
using GreenHouse.Web.Initializer;
using GreenHouse.Web.Library;
using IdentityModel;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using MZBase.Infrastructure;

var builder = WebApplication.CreateBuilder(args);
var mvcBuilder = builder.Services.AddRazorPages();
int cookieLifeTimeMinutes = 120;

if (builder.Environment.IsDevelopment())
{
}

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(
    c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "FacilityMan.API.Web", Version = "v1" });
    }
    );

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
   });

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
builder.Services.AddScoped<HumiditySensorService, HumiditySensorService>();
builder.Services.AddScoped<LightIntensitySensorService, LightIntensitySensorService>();

builder.Services.AddScoped<TemperatureSensorDetailService, TemperatureSensorDetailService>();
builder.Services.AddScoped<LightIntensitySensorDetailService, LightIntensitySensorDetailService>();
builder.Services.AddScoped<HumiditySensorDetailService, HumiditySensorDetailService>();

builder.Services.AddScoped<IDbInitializer, DbInitializer>();

builder.Services.AddIdentity<ApplicationUser, ApplicationRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

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
    if (app.Environment.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
        app.UseSwagger();
        app.UseSwaggerUI();
    }
    else
    {
        app.UseExceptionHandler("/Error");
        app.UseHsts();
    }

    app.UseHttpsRedirection();
    app.UseStaticFiles();
    app.UseRouting();
    app.UseCors();
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
        try
        {

            await next.Invoke();
        }
        catch (Exception ex1)
        {

            throw ex1;

        }

    });
    app.UseAuthorization();

    app.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}");

    app.Run();
}
catch (Exception exception)
{
}