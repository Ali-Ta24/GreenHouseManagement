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
    public class TemperatureSensorDetailService : StorageBusinessService<TemperatureSensorDetail, long>
    {
        private readonly ICoreUnitOfWork _unitOfWork;
        private readonly ILDRCompatibleRepositoryAsync<TemperatureSensorDetail, long> _baseRepo;

        public TemperatureSensorDetailService(ICoreUnitOfWork coreUnitOfWork, ILogger<TemperatureSensorDetail> logger,
            IDateTimeProviderService dateTimeProvider) : base(logger, dateTimeProvider, 500)
        {
            _unitOfWork = coreUnitOfWork;
            _baseRepo = _unitOfWork.GetRepo<TemperatureSensorDetail, long>();
        }

        public async override Task<long> AddAsync(TemperatureSensorDetail item)
        {
            if (item == null)
            {
                var ex = new ServiceArgumentNullException("Input parameter was null:" + nameof(item));
                LogAdd(null, null, ex);
                throw ex;
            }
            var TemperatureSensor = await _unitOfWork.TemperatureSensors.FirstOrDefaultAsync(uu => uu.ID == item.TemperatureSensorID);
            if (TemperatureSensor == null)
            {
                var ex = new ServiceObjectNotFoundException(nameof(TemperatureSensor) + " Not Found");
                LogAdd(item, "TemperatureSensor Related By this TemperatureSensorDetail Not Found", ex);
                throw ex;
            }
            var g = await _baseRepo.InsertAsync(new TemperatureSensorDetailEntity(item));
            try
            {
                await _unitOfWork.CommitAsync();
                LogAdd(item, "Successfully add item with ,ID:" +
                  g.ID.ToString());
                return g.ID;
            }
            catch (Exception ex)
            {
                LogAdd(item, "TemperatureSensorDetailID :" + item.TemperatureSensorID, ex);
                throw new ServiceStorageException("Error adding TemperatureSensorDetail", ex);
            }
        }

        public async Task<LinqDataResult<TemperatureSensorDetail>> ItemsAsync(LinqDataRequest request, int TemperatureSensorID)
        {
            var req = await _unitOfWork.TemperatureSensors.FirstOrDefaultAsync(uu => uu.ID == TemperatureSensorID);

            if (req == null)
            {
                Log(301, "GetTemperatureSensorDetails failed: request with the given id not found", TemperatureSensorID.ToString(), LogTypeEnum.ErrorLog);
                throw new ServiceObjectNotFoundException(nameof(TemperatureSensor));
            }
            LinqDataResult<TemperatureSensorDetail> item = new LinqDataResult<TemperatureSensorDetail>();
            try
            {
                item.Data = await _unitOfWork.TemperatureSensorDetails.GetTemperatureSensorDetailsByTemperatureSensor(TemperatureSensorID);
            }
            catch (Exception ex)
            {
                throw new ServiceStorageException("Error loading TemperatureSensorDetail", ex);
            }

            return item;
        }

        public async override Task ModifyAsync(TemperatureSensorDetail item)
        {
            if (item == null)
            {
                var exception = new ServiceArgumentNullException(nameof(TemperatureSensorDetail));
                LogModify(item, null, exception);
                throw exception;
            }

            var TemperatureSensor = await _unitOfWork.TemperatureSensors.FirstOrDefaultAsync(uu => uu.ID == item.TemperatureSensorID);
            if (TemperatureSensor == null)
            {
                var ex = new ServiceObjectNotFoundException(nameof(TemperatureSensor) + " Not Found");
                LogAdd(item, "TemperatureSensor Related By this TemperatureSensorDetail Not Found", ex);
                throw ex;
            }

            var repo = _unitOfWork.GetRepo<TemperatureSensorDetail, long>();
            var currentItem = await repo.GetByIdAsync(item.ID);

            if (currentItem == null)
            {
                var noObj = new ServiceObjectNotFoundException(nameof(TemperatureSensorDetail) + " Not Found");
                LogModify(item, null, noObj);
                throw noObj;
            }

            await ValidateOnModifyAsync(item, currentItem);

            currentItem.LastModifiedBy = item.LastModifiedBy;
            currentItem.LastModificationTime = item.LastModificationTime;

            currentItem.TemperatureValue = item.TemperatureValue;

            try
            {
                await _unitOfWork.CommitAsync();
                LogModify(item, "Successfully modified item with ,ID:" +
                   item.ID.ToString() +
                   " ,TemperatureValue:" + item.TemperatureValue
                 );
            }

            catch (Exception ex)
            {
                LogModify(item, "TemperatureSensorID :" + currentItem.TemperatureSensorID, ex);
                throw new ServiceStorageException("Error modifying TemperatureSensorID", ex);
            }
        }

        public override Task<TemperatureSensorDetail> RetrieveByIdAsync(long ID)
        {
            throw new NotImplementedException();
        }

        #region Validation
        protected async override Task ValidateOnAddAsync(TemperatureSensorDetail item)
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

        protected async override Task ValidateOnModifyAsync(TemperatureSensorDetail recievedItem, TemperatureSensorDetail storageItem)
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
        private async Task CommonValidateAsync(List<ModelFieldValidationResult> validationErrors, TemperatureSensorDetail item)
        {
            if (item.TemperatureSensorID > 0)
            {
                validationErrors.Add(new ModelFieldValidationResult()
                {
                    Code = _logBaseID + 1,
                    FieldName = nameof(item.TemperatureSensorID),
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
        public override Task RemoveByIdAsync(long ID)
        {
            throw new NotImplementedException();
        }
        public override Task<LinqDataResult<TemperatureSensorDetail>> ItemsAsync(LinqDataRequest request)
        {
            throw new NotImplementedException();
        }
        #endregion
    }
}
