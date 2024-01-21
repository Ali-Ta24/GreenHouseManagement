using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GreenHouse.Web.Controller.MVC.HallManagement
{
    [Authorize]
    public class HallManagementController : Microsoft.AspNetCore.Mvc.Controller
    {
        [HttpGet]
        public IActionResult GreenHouseHall()
        {
            return View();
        }
    }
}
