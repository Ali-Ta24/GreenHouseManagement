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
    public class LightIntensitySensorDetailService : StorageBusinessService<LightIntensitySensorDetail, long>
    {
        private readonly ICoreUnitOfWork _unitOfWork;
        private readonly ILDRCompatibleRepositoryAsync<LightIntensitySensorDetail, long> _baseRepo;

        public LightIntensitySensorDetailService(ICoreUnitOfWork coreUnitOfWork, ILogger<LightIntensitySensorDetail> logger,
            IDateTimeProviderService dateTimeProvider) : base(logger, dateTimeProvider, 600)
        {
            _unitOfWork = coreUnitOfWork;
            _baseRepo = _unitOfWork.GetRepo<LightIntensitySensorDetail, long>();
        }

        public async override Task<long> AddAsync(LightIntensitySensorDetail item)
        {
            if (item == null)
            {
                var ex = new ServiceArgumentNullException("Input parameter was null:" + nameof(item));
                LogAdd(null, null, ex);
                throw ex;
            }
            var LightIntensitySensor = await _unitOfWork.LightIntensitySensors.FirstOrDefaultAsync(uu => uu.ID == item.LightIntensitySensorID);
            if (LightIntensitySensor == null)
            {
                var ex = new ServiceObjectNotFoundException(nameof(LightIntensitySensor) + " Not Found");
                LogAdd(item, "LightIntensitySensor Related By this LightIntensitySensorDetail Not Found", ex);
                throw ex;
            }
            var g = await _baseRepo.InsertAsync(new LightIntensitySensorDetailEntity(item));
            try
            {
                await _unitOfWork.CommitAsync();
                LogAdd(item, "Successfully add item with ,ID:" +
                  g.ID.ToString());
                return g.ID;
            }
            catch (Exception ex)
            {
                LogAdd(item, "LightIntensitySensorDetailID :" + item.LightIntensitySensorID, ex);
                throw new ServiceStorageException("Error adding LightIntensitySensorDetail", ex);
            }
        }

        public async Task<LinqDataResult<LightIntensitySensorDetail>> ItemsAsync(LinqDataRequest request, int LightIntensitySensorID)
        {
            var req = await _unitOfWork.LightIntensitySensors.FirstOrDefaultAsync(uu => uu.ID == LightIntensitySensorID);

            if (req == null)
            {
                Log(301, "GetLightIntensitySensorDetails failed: request with the given id not found", LightIntensitySensorID.ToString(), LogTypeEnum.ErrorLog);
                throw new ServiceObjectNotFoundException(nameof(LightIntensitySensor));
            }
            LinqDataResult<LightIntensitySensorDetail> item = new LinqDataResult<LightIntensitySensorDetail>();
            try
            {
                item.Data = await _unitOfWork.LightIntensitySensorDetails.GetLightIntensitySensorDetailsByLightIntensitySensor(LightIntensitySensorID);
            }
            catch (Exception ex)
            {
                throw new ServiceStorageException("Error loading LightIntensitySensorDetail", ex);
            }

            return item;
        }

        #region Validation
        protected async override Task ValidateOnAddAsync(LightIntensitySensorDetail item)
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
        protected async override Task ValidateOnModifyAsync(LightIntensitySensorDetail recievedItem, LightIntensitySensorDetail storageItem)
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
        private async Task CommonValidateAsync(List<ModelFieldValidationResult> validationErrors, LightIntensitySensorDetail item)
        {
            if (item.LightIntensitySensorID > 0)
            {
                validationErrors.Add(new ModelFieldValidationResult()
                {
                    Code = _logBaseID + 1,
                    FieldName = nameof(item.LightIntensitySensorID),
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
        public async override Task ModifyAsync(LightIntensitySensorDetail item)
        {
            throw new NotImplementedException();
        }
        public override Task<LightIntensitySensorDetail> RetrieveByIdAsync(long ID)
        {
            throw new NotImplementedException();
        }
        public override Task RemoveByIdAsync(long ID)
        {
            throw new NotImplementedException();
        }
        public override Task<LinqDataResult<LightIntensitySensorDetail>> ItemsAsync(LinqDataRequest request)
        {
            throw new NotImplementedException();
        }
        #endregion
    }
}
