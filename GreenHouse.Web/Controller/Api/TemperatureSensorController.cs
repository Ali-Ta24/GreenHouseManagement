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
    public class TemperatureSensorController : BaseApiController
    {
        private readonly TemperatureSensorService _service;
        private readonly IDateTimeProviderService _dateTimeProvider;
        private readonly TemperatureSensorDetailService _temperatureSensorDetailService;
        public TemperatureSensorController(TemperatureSensorService service, TemperatureSensorDetailService temperatureSensorDetailService, IDateTimeProviderService dateTimeProvider)
        {
            _service = service;
            _dateTimeProvider = dateTimeProvider;
            _temperatureSensorDetailService = temperatureSensorDetailService;
        }

        [HttpPost("Post")]
        public async Task<ActionResult> Post(TemperatureSensorDto dto)
        {
            TemperatureSensor item = dto.TemperatureSensorAddDto();

            try
            {
                item.CreatedBy = UserIdName;
                item.CreationTime = _dateTimeProvider.GetNow();
                item.LastModificationTime = item.CreationTime;
                item.LastModifiedBy = item.CreatedBy;

                var insertedID = await _service.AddAsync(item);

                return Ok(insertedID);
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
        public async Task<ActionResult> Put(TemperatureSensorDto dto)
        {
            TemperatureSensor item = dto.TemperatureSensorModifyDto();
            TemperatureSensorDetail sensorDetail = dto.TemperatureSensorGetDto();
            try
            {
                item.LastModificationTime = _dateTimeProvider.GetNow();
                item.LastModifiedBy = UserIdName;
                await _service.ModifyAsync(item);
                if (dto.SensorChanged)
                {
                    sensorDetail.LastModificationTime = item.LastModificationTime;
                    sensorDetail.LastModifiedBy = item.LastModifiedBy;
                    await _temperatureSensorDetailService.AddAsync(sensorDetail);
                }

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

        [HttpGet("GetTemperatureSensors")]
        public async Task<ActionResult<LinqDataResult<TemperatureSensorViewEntity>>> GetTemperatureSensors()
        {
            var request = Request.ToLinqDataRequest();
            try
            {
                var rtn = await _service.ItemsAsync(request, UserIdName);
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

        [HttpGet("GetTemperatureSensorByID")]
        public async Task<ActionResult> GetTemperatureSensorByID(int Id)
        {
            try
            {
                var res = await _service.RetrieveSensorViewByIdAsync(Id);
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

        [HttpGet("GetCountAllTemperatureSensorByUserName")]
        public async Task<ActionResult> GetCountAllTemperatureSensorByUserName()
        {
            try
            {
                var res = _service.GetCountAllTemperatureSensorByUserName(UserIdName);
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
