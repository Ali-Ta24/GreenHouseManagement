using DNTCaptcha.Core;
using Duende.IdentityServer.Events;
using Duende.IdentityServer.Models;
using Duende.IdentityServer.Services;
using Duende.IdentityServer.Stores;
using GreenHouse.DataAccess.Context;
using GreenHouse.DomainEntitty.Identity;
using GreenHouse.Web.Controller.Model;
using GreenHouse.Web.Library;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace GreenHouse.Web.Controller.MVC.Account
{
    public class AccountController : Microsoft.AspNetCore.Mvc.Controller
    {
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
            return View(new LoginViewModel());
        }
    }
}
