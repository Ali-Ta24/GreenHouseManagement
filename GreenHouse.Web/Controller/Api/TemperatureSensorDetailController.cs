using GreenHouse.Model;
using GreenHouse.Services;
using GreenHouse.Web.Controller.Api.Base;
using GreenHouse.Web.Controller.Dto;
using Microsoft.AspNetCore.Mvc;
using MZBase.Infrastructure;
using MZBase.Infrastructure.Service.Exceptions;
using MZSimpleDynamicLinq.Core;

namespace GreenHouse.Web.Controller.Api
{
    [Route("[controller]")]
    [ApiController]

    public class TemperatureSensorDetailController : BaseApiController
    {
        private readonly TemperatureSensorDetailService _service;
        private readonly IDateTimeProviderService _dateTimeProvider;

        public TemperatureSensorDetailController(TemperatureSensorDetailService service, IDateTimeProviderService dateTimeProvider)
        {
            _service = service;
            _dateTimeProvider = dateTimeProvider;
        }

        [HttpPost("GetTemperatureSensors")]
        public async Task<ActionResult<LinqDataResult<TemperatureSensorDateilDto>>> GetTemperatureSensors(LinqDataRequest request, int TemperatureSensorID)
        {
            try
            {
                var rtn = await _service.ItemsAsync(request, TemperatureSensorID);
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

        [HttpPost("UpTemperatureSensors")]
        public async Task<ActionResult> UpTemperatureSensors(TemperatureSensorDateilDto dto)
        {
            TemperatureSensorDetail item = dto.GetTemperatureSensorDetail();
            try
            {
                item.LastModificationTime = _dateTimeProvider.GetNow();
                item.LastModifiedBy = UserIdName;

                await _service.AddAsync(item);

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
    }
}
