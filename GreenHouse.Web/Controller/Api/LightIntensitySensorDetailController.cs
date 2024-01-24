using GreenHouse.Model;
using GreenHouse.Services;
using GreenHouse.Web.Controller.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MZBase.Infrastructure.Service.Exceptions;
using MZBase.Infrastructure;
using MZSimpleDynamicLinq.Core;
using GreenHouse.Web.Controller.Api.Base;

namespace GreenHouse.Web.Controller.Api
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class LightIntensitySensorDetailController : BaseApiController
    {
        private readonly LightIntensitySensorDetailService _service;
        private readonly IDateTimeProviderService _dateTimeProvider;

        public LightIntensitySensorDetailController(LightIntensitySensorDetailService service, IDateTimeProviderService dateTimeProvider)
        {
            _service = service;
            _dateTimeProvider = dateTimeProvider;
        }

        [HttpPost("GetLightIntensitySensors")]
        public async Task<ActionResult<LinqDataResult<LightIntensitySensorDetailDto>>> GetLightIntensitySensors(LinqDataRequest request, int LightIntensitySensorID)
        {
            try
            {
                var rtn = await _service.ItemsAsync(request, LightIntensitySensorID);
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

        [HttpPost("UpLightIntensitySensors")]
        public async Task<ActionResult> UpLightIntensitySensors(LightIntensitySensorDetailDto dto)
        {
            LightIntensitySensorDetail item = dto.GetLightIntensitySensorDetail();
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
