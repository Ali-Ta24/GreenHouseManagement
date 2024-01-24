using GreenHouse.DataAccess.UnitOfWork;
using GreenHouse.DomainEntity;
using GreenHouse.Model;
using Microsoft.Extensions.Logging;
using MZBase.Infrastructure;
using MZBase.Infrastructure.Service;
using MZBase.Infrastructure.Service.Exceptions;
using MZSimpleDynamicLinq.Core;

namespace GreenHouse.Services
{
    public class HumiditySensorDetailService : StorageBusinessService<HumiditySensorDetail, long>
    {
        private readonly ICoreUnitOfWork _unitOfWork;
        private readonly ILDRCompatibleRepositoryAsync<HumiditySensorDetail, long> _baseRepo;

        public HumiditySensorDetailService(ICoreUnitOfWork coreUnitOfWork, ILogger<HumiditySensorDetail> logger,
            IDateTimeProviderService dateTimeProvider) : base(logger, dateTimeProvider, 500)
        {
            _unitOfWork = coreUnitOfWork;
            _baseRepo = _unitOfWork.GetRepo<HumiditySensorDetail, long>();
        }

        public async override Task<long> AddAsync(HumiditySensorDetail item)
        {
            if (item == null)
            {
                var ex = new ServiceArgumentNullException("Input parameter was null:" + nameof(item));
                LogAdd(null, null, ex);
                throw ex;
            }
            var HumiditySensor = await _unitOfWork.HumiditySensors.FirstOrDefaultAsync(uu => uu.ID == item.HumiditySensorID);
            if (HumiditySensor == null)
            {
                var ex = new ServiceObjectNotFoundException(nameof(HumiditySensor) + " Not Found");
                LogAdd(item, "HumiditySensor Related By this HumiditySensorDetail Not Found", ex);
                throw ex;
            }
            var g = await _baseRepo.InsertAsync(new HumiditySensorDetailEntity(item));
            try
            {
                await _unitOfWork.CommitAsync();
                LogAdd(item, "Successfully add item with ,ID:" +
                  g.ID.ToString());
                return g.ID;
            }
            catch (Exception ex)
            {
                LogAdd(item, "HumiditySensorDetailID :" + item.HumiditySensorID, ex);
                throw new ServiceStorageException("Error adding HumiditySensorDetail", ex);
            }
        }

        public async Task<LinqDataResult<HumiditySensorDetail>> ItemsAsync(LinqDataRequest request, int HumiditySensorID)
        {
            var req = await _unitOfWork.HumiditySensors.FirstOrDefaultAsync(uu => uu.ID == HumiditySensorID);

            if (req == null)
            {
                Log(301, "GetHumiditySensorDetails failed: request with the given id not found", HumiditySensorID.ToString(), LogTypeEnum.ErrorLog);
                throw new ServiceObjectNotFoundException(nameof(HumiditySensor));
            }
            LinqDataResult<HumiditySensorDetail> item = new LinqDataResult<HumiditySensorDetail>();
            try
            {
                item.Data = await _unitOfWork.HumiditySensorDetails.GetHumiditySensorDetailsByHumiditySensor(HumiditySensorID);
            }
            catch (Exception ex)
            {
                throw new ServiceStorageException("Error loading HumiditySensorDetail", ex);
            }

            return item;
        }

        #region Validation
        protected async override Task ValidateOnAddAsync(HumiditySensorDetail item)
        {
            List<ModelFieldValidationResult> _validationErrors = new List<ModelFieldValidationResult>();

            await CommonValidateAsync(_validationErrors, item);

            if (_validationErrors.Any())
            {
                var exp = new ServiceModelValidationException(_validationErrors, "Error validating the model");
                LogAdd(item, "Error in Adding item when validating:" + exp.JSONFormattedErrors, exp);
                throw exp;
            }
        }
        protected async override Task ValidateOnModifyAsync(HumiditySensorDetail recievedItem, HumiditySensorDetail storageItem)
        {
            List<ModelFieldValidationResult> _validationErrors = new List<ModelFieldValidationResult>();

            await CommonValidateAsync(_validationErrors, recievedItem);

            if (_validationErrors.Any())
            {
                var exp = new ServiceModelValidationException(_validationErrors, "Error validating the model");
                LogModify(recievedItem, "Error in Modifing item when validating:" + exp.JSONFormattedErrors, exp);
                throw exp;
            }
        }
        private async Task CommonValidateAsync(List<ModelFieldValidationResult> validationErrors, HumiditySensorDetail item)
        {
            if (item.HumiditySensorID > 0)
            {
                validationErrors.Add(new ModelFieldValidationResult()
                {
                    Code = _logBaseID + 1,
                    FieldName = nameof(item.HumiditySensorID),
                    ValidationMessage = "The Field Can Not Be Zero"
                });
            }

            if (string.IsNullOrWhiteSpace(item.LastModifiedBy))
            {
                validationErrors.Add(new ModelFieldValidationResult
                {
                    FieldName = "LastModifiedBy",
                    ValidationMessage = "The value of field 'LastModifiedBy' must not be empty",
                    Code = 2
                });
            }

            if (item.LastModificationTime == DateTime.MinValue)
            {
                validationErrors.Add(new ModelFieldValidationResult
                {
                    FieldName = "LastModificationTime",
                    ValidationMessage = "The value is invalid",
                    Code = 6
                });
            }

        }
        #endregion

        #region Unimplement
        public async override Task ModifyAsync(HumiditySensorDetail item)
        {
            throw new NotImplementedException();
        }
        public override Task<HumiditySensorDetail> RetrieveByIdAsync(long ID)
        {
            throw new NotImplementedException();
        }
        public override Task RemoveByIdAsync(long ID)
        {
            throw new NotImplementedException();
        }
        public override Task<LinqDataResult<HumiditySensorDetail>> ItemsAsync(LinqDataRequest request)
        {
            throw new NotImplementedException();
        }
        #endregion
    }
}
