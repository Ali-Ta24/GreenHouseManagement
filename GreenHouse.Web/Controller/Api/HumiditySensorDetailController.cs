using GreenHouse.Model;
using GreenHouse.Services;
using GreenHouse.Web.Controller.Dto;
using Microsoft.AspNetCore.Mvc;
using MZBase.Infrastructure.Service.Exceptions;
using MZBase.Infrastructure;
using MZSimpleDynamicLinq.Core;
using Microsoft.AspNetCore.Authorization;
using GreenHouse.Web.Controller.Api.Base;

namespace GreenHouse.Web.Controller.Api
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class HumiditySensorDetailController : BaseApiController
    {
        private readonly HumiditySensorDetailService _service;
        private readonly IDateTimeProviderService _dateTimeProvider;

        public HumiditySensorDetailController(HumiditySensorDetailService service, IDateTimeProviderService dateTimeProvider)
        {
            _service = service;
            _dateTimeProvider = dateTimeProvider;
        }

        [HttpPost("GetHumiditySensors")]
        public async Task<ActionResult<LinqDataResult<HumiditySensorDetailDto>>> GetHumiditySensors(LinqDataRequest request, int HumiditySensorID)
        {
            try
            {
                var rtn = await _service.ItemsAsync(request, HumiditySensorID);
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

        [HttpPost("UpHumiditySensors")]
        public async Task<ActionResult> UpHumiditySensors(HumiditySensorDetailDto dto)
        {
            HumiditySensorDetail item = dto.GetHumiditySensorDetail();
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
