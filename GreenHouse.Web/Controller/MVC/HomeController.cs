using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace GreenHouse.Web.Controller.MVC
{
    public class HomeController : Microsoft.AspNetCore.Mvc.Controller
    {
        [Authorize]
        public IActionResult Index()
        {
            return View();
        }
    }
}
