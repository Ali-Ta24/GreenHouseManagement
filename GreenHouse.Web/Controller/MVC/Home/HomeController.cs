using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GreenHouse.Web.Controller.MVC.Home
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
