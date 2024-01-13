using GreenHouse.Model;
using GreenHouse.Services;
using GreenHouse.Web.Controller.Api.Base;
using GreenHouse.Web.Controller.Dto;
using Microsoft.AspNetCore.Mvc;
using MZBase.Infrastructure;
using MZBase.Infrastructure.Service.Exceptions;

namespace GreenHouse.Web.Controller.Api
{
    [Route("[controller]")]
    [ApiController]
    public class UserGreenhouseHallController : BaseApiController
    {
        private readonly UserGreenhouseHallService _service;
        private readonly IDateTimeProviderService _dateTimeProvider;

        public UserGreenhouseHallController(UserGreenhouseHallService service, IDateTimeProviderService dateTimeProvider)
        {
            _service = service;
            _dateTimeProvider = dateTimeProvider;
        }

        [HttpPost("Post")]
        public async Task<ActionResult> Post(UserGreenhouseHallDto dto)
        {
            UserGreenhouseHall item = dto.GetUserGreenhouseHall();

            try
            {
                item.UserID = UserId;
                item.CreatedBy = UserIdName;
                item.CreationTime = _dateTimeProvider.GetNow();
                item.LastModificationTime = item.CreationTime;
                item.LastModifiedBy = item.CreatedBy;

                var g = await _service.AddAsync(item);

                item.ID = g;
                return Ok(g);
            }
            catch (ServiceException ex)
            {
                if (ex is ServiceModelValidationException)
                {
                    return BadRequest(ex.Message + ", " + (ex as ServiceModelValidationException).JSONFormattedErrors);
                }
                return StatusCode(500, ex.ToServiceExceptionString());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
