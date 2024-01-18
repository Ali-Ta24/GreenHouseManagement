using GreenHouse.Model;
using GreenHouse.Services;
using GreenHouse.Web.Controller.Api.Base;
using GreenHouse.Web.Controller.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MZBase.Infrastructure;
using MZBase.Infrastructure.Service.Exceptions;

namespace GreenHouse.Web.Controller.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
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

        //[HttpGet("GetGreenhouseHall")]
        //public async Task<ActionResult<LinqDataResult<TemperatureSensorViewEntity>>> GetGreenhouseHall()
        //{
        //    var request = Request.ToLinqDataRequest();
        //    try
        //    {
        //        var rtn = await _service.ItemsAsync(request, GreenHouseID, UserIdName);
        //        return Ok(rtn);
        //    }
        //    catch (ServiceException ex)
        //    {
        //        return StatusCode(500, ex.ToServiceExceptionString());
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, ex.Message);
        //    }
        //}

        [HttpGet("GetAllGreenhouseHallByUser")]
        public async Task<IActionResult> GetAllGreenhouseHallByUser()
        {
            try
            {
                var rtn = await _service.GetAllGreenHouseByUser(UserId);
                return Ok(rtn);
            }
            catch (ServiceException ex)
            {
                return StatusCode(500, ex.ToServiceExceptionString());
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("GetCountAllGreenhouseHallByUserName")]
        public async Task<ActionResult> GetCountAllGreenhouseHallByUserName()
        {
            try
            {
                var res = await _service.GetCountAllGreenhouseHallByUserName(UserId);
                return Ok(res);
            }
            catch (ServiceException ex)
            {
                return StatusCode(500, ex.ToServiceExceptionString());
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
