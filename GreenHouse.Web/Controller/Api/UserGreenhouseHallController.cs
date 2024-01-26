using GreenHouse.DomainEntity.Views;
using GreenHouse.Model;
using GreenHouse.Services;
using GreenHouse.Web.Controller.Api.Base;
using GreenHouse.Web.Controller.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MZBase.Infrastructure;
using MZBase.Infrastructure.Service.Exceptions;
using MZSimpleDynamicLinq.Core;
using MZSimpleDynamicLinq.HttpRequestExtensions;

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

        [HttpPut("Put")]
        public async Task<ActionResult> Put(UserGreenhouseHallDto dto)
        {
            UserGreenhouseHall item = dto.GetUserGreenhouseHall();
            try
            {
                item.LastModificationTime = _dateTimeProvider.GetNow();
                item.LastModifiedBy = UserIdName;
                await _service.ModifyAsync(item);

                return Ok();
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
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("Delete")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                await _service.RemoveByIdAsync(id);
                return Ok();
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

        [HttpGet("GetGreenhouseHalls")]
        public async Task<ActionResult<LinqDataResult<GreenhouseHallViewEntity>>> GetGreenhouseHalls()
       {
            var request = Request.ToLinqDataRequest();
            try
            {
                var rtn = await _service.GetAllGreenHouseByUserId(request, UserId);
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

        [HttpGet("GetGreenhouseHallByID")]
        public async Task<ActionResult> GetGreenhouseHallByID(int Id)
        {
            try
            {
                var res = await _service.RetrieveByIdAsync(Id);
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
