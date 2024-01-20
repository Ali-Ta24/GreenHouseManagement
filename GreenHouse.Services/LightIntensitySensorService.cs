using GreenHouse.DataAccess.UnitOfWork;
using GreenHouse.DomainEntity;
using GreenHouse.DomainEntity.Views;
using GreenHouse.Model;
using Microsoft.Extensions.Logging;
using MZBase.Infrastructure;
using MZBase.Infrastructure.Service;
using MZBase.Infrastructure.Service.Exceptions;
using MZSimpleDynamicLinq.Core;

namespace GreenHouse.Services
{
    public class LightIntensitySensorService : StorageBusinessService<LightIntensitySensor, int>
    {
        private readonly ICoreUnitOfWork _unitOfWork;
        private readonly ILDRCompatibleRepositoryAsync<LightIntensitySensor, int> _baseRepo;

        public LightIntensitySensorService(ICoreUnitOfWork coreUnitOfWork, ILogger<LightIntensitySensor> logger, IDateTimeProviderService dateTimeProvider)
            : base(logger, dateTimeProvider, 300)
        {
            _unitOfWork = coreUnitOfWork;
            _baseRepo = _unitOfWork.GetRepo<LightIntensitySensor, int>();
        }

        public async override Task<int> AddAsync(LightIntensitySensor item)
        {
            if (item == null)
            {
                var ex = new ServiceArgumentNullException("Input parameter was null:" + nameof(item));
                LogAdd(null, null, ex);
                throw ex;
            }
            var UserGreenhouseHall = await _unitOfWork.UserGreenhouseHalls.FirstOrDefaultAsync(uu => uu.ID == item.GreenhouseHallID);
            if (UserGreenhouseHall == null)
            {
                var ex = new ServiceObjectNotFoundException(nameof(UserGreenhouseHall) + " Not Found");
                LogAdd(item, "UserGreenhouseHall Related By this LightIntensitySensor Not Found", ex);
                throw ex;
            }
            await ValidateOnAddAsync(item);
            var g = await _baseRepo.InsertAsync(new LightIntensitySensorEntity(item));
            try
            {
                await _unitOfWork.CommitAsync();
                LogAdd(item, "Successfully add item with ,ID:" +
                  g.ID.ToString() +
                  " ,LightIntensitySensorName:" + item.LightIntensitySensorName
                 );
                return g.ID;
            }
            catch (Exception ex)
            {
                LogAdd(item, "LightIntensitySensorName :" + item.LightIntensitySensorName, ex);
                throw new ServiceStorageException("Error adding LightIntensitySensorName", ex);
            }
        }

        public async Task<LinqDataResult<LightIntensitySensorViewEntity>> ItemsAsync(LinqDataRequest request, int GreenHouseID, string UserName)
        {
            var req = await _unitOfWork.UserGreenhouseHalls.FirstOrDefaultAsync(uu => uu.ID == GreenHouseID);

            if (req == null)
            {
                Log(301, "GetLightIntensitySensors failed: request with the given id not found", GreenHouseID.ToString(), LogTypeEnum.ErrorLog);
                throw new ServiceObjectNotFoundException(nameof(UserGreenhouseHall));
            }
            //LinqDataResult<LightIntensitySensorViewEntity> item = new LinqDataResult<LightIntensitySensorViewEntity>();
            try
            {
                return await _unitOfWork.LightIntensitySensors.GetLightIntensitySensorsByGreenhouseHall(request, GreenHouseID, UserName);
            }
            catch (Exception ex)
            {
                throw new ServiceStorageException("Error loading LightIntensitySensor", ex);
            }
        }

        public async override Task ModifyAsync(LightIntensitySensor item)
        {
            if (item == null)
            {
                var exception = new ServiceArgumentNullException(typeof(LightIntensitySensor).Name);
                LogModify(item, null, exception);
                throw exception;
            }

            var UserGreenhouseHall = await _unitOfWork.UserGreenhouseHalls.FirstOrDefaultAsync(uu => uu.ID == item.GreenhouseHallID);
            if (UserGreenhouseHall == null)
            {
                var ex = new ServiceObjectNotFoundException(nameof(UserGreenhouseHall) + " Not Found");
                LogAdd(item, "UserGreenhouseHall Related By this LightIntensitySensor Not Found", ex);
                throw ex;
            }

            var repo = _unitOfWork.GetRepo<LightIntensitySensor, int>();
            var currentItem = await repo.GetByIdAsync(item.ID);

            if (currentItem == null)
            {
                var noObj = new ServiceObjectNotFoundException(typeof(LightIntensitySensor).Name + " Not Found");
                LogModify(item, null, noObj);
                throw noObj;
            }

            await ValidateOnModifyAsync(item, currentItem);

            currentItem.LastModifiedBy = item.LastModifiedBy;
            currentItem.LastModificationTime = item.LastModificationTime;

            currentItem.LightIntensitySensorName = item.LightIntensitySensorName;
            currentItem.GreenhouseHallID = item.GreenhouseHallID;
            try
            {
                await _unitOfWork.CommitAsync();
                LogModify(item, "Successfully modified item with ,ID:" +
                   item.ID.ToString() +
                   " ,LightIntensitySensorName:" + item.LightIntensitySensorName
                 );
            }

            catch (Exception ex)
            {
                LogModify(item, "LightIntensitySensorName :" + currentItem.LightIntensitySensorName, ex);
                throw new ServiceStorageException("Error modifying LightIntensitySensor", ex);
            }
        }

        public async override Task RemoveByIdAsync(int ID)
        {
            var itemToDelete = await _baseRepo.FirstOrDefaultAsync(ss => ss.ID == ID);

            if (itemToDelete == null)
            {
                var f = new ServiceObjectNotFoundException(nameof(LightIntensitySensor) + " not found");
                LogRemove(ID, "Item With This Id Not Found", f);
                throw f;
            }

            await _baseRepo.DeleteAsync(itemToDelete);
            try
            {
                await _unitOfWork.CommitAsync();
                LogRemove(ID, "Item Deleted Successfully", null);
            }

            catch (Exception ex)
            {
                var innerEx = new ServiceStorageException("Error deleting item with id" + ID.ToString(), ex);
                LogRemove(ID, null, ex);
                throw innerEx;
            }
        }

        public async override Task<LightIntensitySensor> RetrieveByIdAsync(int ID)
        {
            LightIntensitySensor? item;
            try
            {
                item = await _baseRepo.FirstOrDefaultAsync(ss => ss.ID == ID);
            }
            catch (Exception ex)
            {
                LogRetrieveSingle(ID, ex);
                throw new ServiceStorageException("Error loading LightIntensitySensor", ex);
            }
            if (item == null)
            {
                var f = new ServiceObjectNotFoundException(nameof(LightIntensitySensor) + " not found by id");
                LogRetrieveSingle(ID, f);
                throw f;
            }
            LogRetrieveSingle(ID);
            return item;
        }

        public async Task<LinqDataResult<LightIntensitySensorViewEntity>> GetLightIntensitySensors(LinqDataRequest request, int greenhouseId)
        {
            LinqDataResult<LightIntensitySensorViewEntity> item = new LinqDataResult<LightIntensitySensorViewEntity>();
            try
            {
                //item.Data = await _unitOfWork.LightIntensitySensors.GetLightIntensitySensorsByGreenhouseHall(greenhouseId);
            }
            catch (Exception ex)
            {
                throw new ServiceStorageException("Error loading LightIntensitySensor", ex);
            }

            return item;
        }

        #region Validation
        protected async override Task ValidateOnAddAsync(LightIntensitySensor item)
        {
            List<ModelFieldValidationResult> _validationErrors = new List<ModelFieldValidationResult>();

            await CommonValidateAsync(_validationErrors, item);
            ValidateIAuditableOnAdd(_validationErrors, item);

            if (_validationErrors.Any())
            {
                var exp = new ServiceModelValidationException(_validationErrors, "Error validating the model");
                LogAdd(item, "Error in Adding item when validating:" + exp.JSONFormattedErrors, exp);
                throw exp;
            }
        }

        protected async override Task ValidateOnModifyAsync(LightIntensitySensor recievedItem, LightIntensitySensor storageItem)
        {
            List<ModelFieldValidationResult> _validationErrors = new List<ModelFieldValidationResult>();

            await CommonValidateAsync(_validationErrors, recievedItem);
            ValidateIAuditableOnModify(_validationErrors, recievedItem, storageItem);

            if (_validationErrors.Any())
            {
                var exp = new ServiceModelValidationException(_validationErrors, "Error validating the model");
                LogModify(recievedItem, "Error in Modifing item when validating:" + exp.JSONFormattedErrors, exp);
                throw exp;
            }
        }
        private async Task CommonValidateAsync(List<ModelFieldValidationResult> validationErrors, LightIntensitySensor item)
        {
            if (string.IsNullOrEmpty(item.LightIntensitySensorName))
            {
                validationErrors.Add(new ModelFieldValidationResult()
                {
                    Code = _logBaseID + 1,
                    FieldName = nameof(item.LightIntensitySensorName),
                    ValidationMessage = "The Field Can Not Be Empty"
                });
            }
        }
        #endregion

        public override Task<LinqDataResult<LightIntensitySensor>> ItemsAsync(LinqDataRequest request)
        {
            throw new NotImplementedException();
        }

        public int GetCountAllLightIntensitySensorByUserName(string userName)
        {
            try
            {
                return _unitOfWork.LightIntensitySensors.GetCountAllLightIntensitySensorByUserName(userName);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}