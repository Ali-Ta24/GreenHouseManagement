using GreenHouse.DataAccess.UnitOfWork;
using GreenHouse.DomainEntity;
using GreenHouse.DomainEntity.Views;
using GreenHouse.Model;
using GreenHouse.Model.Views;
using Microsoft.Extensions.Logging;
using MZBase.Infrastructure;
using MZBase.Infrastructure.Service;
using MZBase.Infrastructure.Service.Exceptions;
using MZSimpleDynamicLinq.Core;

namespace GreenHouse.Services
{
    public class HumiditySensorService : StorageBusinessService<HumiditySensor, int>
    {
        private readonly ICoreUnitOfWork _unitOfWork;
        private readonly ILDRCompatibleRepositoryAsync<HumiditySensor, int> _baseRepo;
        private readonly HumiditySensorDetailService _humiditySensorDetailService;

        public HumiditySensorService(ICoreUnitOfWork coreUnitOfWork, ILogger<HumiditySensor> logger, IDateTimeProviderService dateTimeProvider, HumiditySensorDetailService humiditySensorDetailService)
            : base(logger, dateTimeProvider, 400)
        {
            _unitOfWork = coreUnitOfWork;
            _baseRepo = _unitOfWork.GetRepo<HumiditySensor, int>();
            _humiditySensorDetailService = humiditySensorDetailService;
        }

        public async override Task<int> AddAsync(HumiditySensor item)
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
                LogAdd(item, "UserGreenhouseHall Related By this HumiditySensor Not Found", ex);
                throw ex;
            }
            await ValidateOnAddAsync(item);
            var g = await _baseRepo.InsertAsync(new HumiditySensorEntity(item));
            try
            {
                await _unitOfWork.CommitAsync();
                LogAdd(item, "Successfully add item with ,ID:" +
                  g.ID.ToString() +
                  " ,HumiditySensorName:" + item.HumiditySensorName
                 );
                await _humiditySensorDetailService.AddAsync(new HumiditySensorDetail
                {
                    HumiditySensorID = g.ID,
                    HumiditySensorValue = 0,
                    LastModifiedBy = item.LastModifiedBy,
                    LastModificationTime = item.LastModificationTime,
                });
                return g.ID;
            }
            catch (Exception ex)
            {
                LogAdd(item, "HumiditySensorName :" + item.HumiditySensorName, ex);
                throw new ServiceStorageException("Error adding HumiditySensorName", ex);
            }
        }

        public async Task<LinqDataResult<HumiditySensorViewEntity>> ItemsAsync(LinqDataRequest request, string UserName)
        {
            try
            {
                return await _unitOfWork.HumiditySensors.GetHumiditySensorsByGreenhouseHall(request, UserName);
            }
            catch (Exception ex)
            {
                throw new ServiceStorageException("Error loading HumiditySensor", ex);
            }
        }

        public async override Task ModifyAsync(HumiditySensor item)
        {
            if (item == null)
            {
                var exception = new ServiceArgumentNullException(typeof(HumiditySensor).Name);
                LogModify(item, null, exception);
                throw exception;
            }

            var UserGreenhouseHall = await _unitOfWork.UserGreenhouseHalls.FirstOrDefaultAsync(uu => uu.ID == item.GreenhouseHallID);
            if (UserGreenhouseHall == null)
            {
                var ex = new ServiceObjectNotFoundException(nameof(UserGreenhouseHall) + " Not Found");
                LogAdd(item, "UserGreenhouseHall Related By this HumiditySensor Not Found", ex);
                throw ex;
            }

            var repo = _unitOfWork.GetRepo<HumiditySensor, int>();
            var currentItem = await repo.GetByIdAsync(item.ID);

            if (currentItem == null)
            {
                var noObj = new ServiceObjectNotFoundException(typeof(HumiditySensor).Name + " Not Found");
                LogModify(item, null, noObj);
                throw noObj;
            }

            await ValidateOnModifyAsync(item, currentItem);

            currentItem.LastModifiedBy = item.LastModifiedBy;
            currentItem.LastModificationTime = item.LastModificationTime;

            currentItem.HumiditySensorName = item.HumiditySensorName;
            currentItem.GreenhouseHallID = item.GreenhouseHallID;
            try
            {
                await _unitOfWork.CommitAsync();
                LogModify(item, "Successfully modified item with ,ID:" +
                   item.ID.ToString() +
                   " ,HumiditySensorName:" + item.HumiditySensorName
                 );
            }
            catch (Exception ex)
            {
                LogModify(item, "HumiditySensorName :" + currentItem.HumiditySensorName, ex);
                throw new ServiceStorageException("Error modifying HumiditySensor", ex);
            }
        }

        public async override Task RemoveByIdAsync(int ID)
        {
            var itemToDelete = await _baseRepo.FirstOrDefaultAsync(ss => ss.ID == ID);

            if (itemToDelete == null)
            {
                var f = new ServiceObjectNotFoundException(nameof(HumiditySensor) + " not found");
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

        public async override Task<HumiditySensor> RetrieveByIdAsync(int ID)
        {
            HumiditySensor? item;
            try
            {
                item = await _baseRepo.FirstOrDefaultAsync(ss => ss.ID == ID);
            }
            catch (Exception ex)
            {
                LogRetrieveSingle(ID, ex);
                throw new ServiceStorageException("Error loading HumiditySensor", ex);
            }
            if (item == null)
            {
                var f = new ServiceObjectNotFoundException(nameof(HumiditySensor) + " not found by id");
                LogRetrieveSingle(ID, f);
                throw f;
            }
            LogRetrieveSingle(ID);
            return item;
        }

        public async Task<HumiditySensorView> RetrieveSensorViewByIdAsync(int ID)
        {
            HumiditySensorView? item;
            try
            {
                item = await _unitOfWork.HumiditySensors.GetHumiditySensorViewsByID(ID);
            }
            catch (Exception ex)
            {
                LogRetrieveSingle(ID, ex);
                throw new ServiceStorageException("Error loading HumiditySensor", ex);
            }
            if (item == null)
            {
                var f = new ServiceObjectNotFoundException(nameof(HumiditySensor) + " not found by id");
                LogRetrieveSingle(ID, f);
                throw f;
            }
            LogRetrieveSingle(ID);
            return item;
        }

        public async Task<LinqDataResult<HumiditySensorViewEntity>> GetHumiditySensors(LinqDataRequest request, int greenhouseId)
        {
            LinqDataResult<HumiditySensorViewEntity> item = new LinqDataResult<HumiditySensorViewEntity>();
            try
            {
                //item.Data = await _unitOfWork.HumiditySensors.GetHumiditySensorsByGreenhouseHall(greenhouseId);
            }
            catch (Exception ex)
            {
                throw new ServiceStorageException("Error loading HumiditySensor", ex);
            }

            return item;
        }

        #region Validation
        protected async override Task ValidateOnAddAsync(HumiditySensor item)
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
        protected async override Task ValidateOnModifyAsync(HumiditySensor recievedItem, HumiditySensor storageItem)
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

        private async Task CommonValidateAsync(List<ModelFieldValidationResult> validationErrors, HumiditySensor item)
        {
            if (string.IsNullOrEmpty(item.HumiditySensorName))
            {
                validationErrors.Add(new ModelFieldValidationResult()
                {
                    Code = _logBaseID + 1,
                    FieldName = nameof(item.HumiditySensorName),
                    ValidationMessage = "The Field Can Not Be Empty"
                });
            }
        }
        #endregion

        public override Task<LinqDataResult<HumiditySensor>> ItemsAsync(LinqDataRequest request)
        {
            throw new NotImplementedException();
        }

        public int GetCountAllHumiditySensorByUserName(string userName)
        {
            try
            {
                return _unitOfWork.HumiditySensors.GetCountAllHumiditySensorByUserName(userName);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}