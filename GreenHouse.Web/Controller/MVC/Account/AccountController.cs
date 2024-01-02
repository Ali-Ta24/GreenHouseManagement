using GreenHouse.Web.Controller.Model;
using Microsoft.AspNetCore.Mvc;

namespace GreenHouse.Web.Controller.MVC.Account
{
    public class AccountController : Microsoft.AspNetCore.Mvc.Controller
    {

        [HttpGet]
        public async Task<IActionResult> Login()
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
