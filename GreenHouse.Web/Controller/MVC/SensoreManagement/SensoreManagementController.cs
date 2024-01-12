using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GreenHouse.Web.Controller.MVC.SensoreManagement
{
    public class SensoreManagementController : Microsoft.AspNetCore.Mvc.Controller
    {
        [Authorize]
        [HttpGet]
        public IActionResult TemperatureSensor()
        {
            return View();
        }
    }
}
