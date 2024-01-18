using GreenHouse.DomainEntity.Views;
using GreenHouse.Model;
using GreenHouse.Services;
using GreenHouse.Web.Controller.Api.Base;
using GreenHouse.Web.Controller.Dto;
using Microsoft.AspNetCore.Mvc;
using MZBase.Infrastructure;
using MZBase.Infrastructure.Service.Exceptions;
using MZSimpleDynamicLinq.Core;
using MZSimpleDynamicLinq.HttpRequestExtensions;

namespace GreenHouse.Web.Controller.Api
{
    public class HumiditySensorController : BaseApiController
    {
        private readonly HumiditySensorService _service;
        private readonly IDateTimeProviderService _dateTimeProvider;

        public HumiditySensorController(HumiditySensorService service, IDateTimeProviderService dateTimeProvider)
        {
            _service = service;
            _dateTimeProvider = dateTimeProvider;
        }

        [HttpPost("Post")]
        public async Task<ActionResult> Post(HumiditySensorDto dto)
        {
            HumiditySensor item = dto.GetHumiditySensor();

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
        public async Task<ActionResult> Put(HumiditySensorDto dto)
        {
            HumiditySensor item = dto.GetHumiditySensor();
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

        [HttpGet("GetHumiditySensors")]
        public async Task<ActionResult<LinqDataResult<HumiditySensorViewEntity>>> GetHumiditySensors(int GreenHouseID)
        {
            var request = Request.ToLinqDataRequest();
            try
            {
                var rtn = await _service.ItemsAsync(request, GreenHouseID, UserIdName);
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

        [HttpGet("GetHumiditySensorByID")]
        public async Task<ActionResult> GetHumiditySensorByID(int Id)
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
