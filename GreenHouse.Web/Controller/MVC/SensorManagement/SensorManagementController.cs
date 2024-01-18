using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GreenHouse.Web.Controller.MVC.SensorManagement
{
    [Authorize]
    public class SensorManagementController : Microsoft.AspNetCore.Mvc.Controller
    {
        [HttpGet]
        public IActionResult TemperatureSensor()
        {
            return View();
        }

        [HttpGet]
        public IActionResult HumiditySensor()
        {
            return View();
        }

        [HttpGet]
        public IActionResult LightIntensitySensor()
        {
            return View();
        }
    }
}
