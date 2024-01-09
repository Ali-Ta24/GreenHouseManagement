using GreenHouse.Model;
using GreenHouse.Services;
using GreenHouse.Web.Controller.Api.Base;
using GreenHouse.Web.Controller.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MZBase.Infrastructure;
using MZBase.Infrastructure.Service.Exceptions;
using MZSimpleDynamicLinq.Core;

namespace GreenHouse.Web.Controller.Api
{
    [AllowAnonymous]
    public class TemperatureSensorController : BaseApiController
    {
        private readonly TemperatureSensorService _service;
        private readonly IDateTimeProviderService _dateTimeProvider;

        public TemperatureSensorController(TemperatureSensorService service, IDateTimeProviderService dateTimeProvider)
        {
            _service = service;
            _dateTimeProvider = dateTimeProvider;
        }

        [HttpPost("Post")]
        public async Task<ActionResult> Post(TemperatureSensorDto dto)
        {
            TemperatureSensor item = dto.GetTemperatureSensor();

            try
            {
                item.CreatedBy = UserName;
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
            TemperatureSensor item = dto.GetTemperatureSensor();
            try
            {

                item.LastModificationTime = _dateTimeProvider.GetNow();
                item.LastModifiedBy = UserName;

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

        [HttpPost("GetTemperatureSensors")]
        public async Task<ActionResult<LinqDataResult<TemperatureSensorDto>>> GetTemperatureSensors(LinqDataRequest request, int greenhouseId)
        {
            try
            {
                var rtn = await _service.GetTemperatureSensors(request, greenhouseId);
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
    }
}
