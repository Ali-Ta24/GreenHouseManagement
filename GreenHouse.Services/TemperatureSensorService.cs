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
    public class TemperatureSensorService : StorageBusinessService<TemperatureSensor, int>
    {
        private readonly ICoreUnitOfWork _unitOfWork;
        private readonly ILDRCompatibleRepositoryAsync<TemperatureSensor, int> _baseRepo;
        private readonly TemperatureSensorDetailService _temperatureSensorDetailService;
        public TemperatureSensorService(ICoreUnitOfWork coreUnitOfWork, ILogger<TemperatureSensor> logger, IDateTimeProviderService dateTimeProvider, TemperatureSensorDetailService temperatureSensorDetailService)
            : base(logger, dateTimeProvider, 200)
        {
            _unitOfWork = coreUnitOfWork;
            _baseRepo = _unitOfWork.GetRepo<TemperatureSensor, int>();
            _temperatureSensorDetailService = temperatureSensorDetailService;
        }

        public async override Task<int> AddAsync(TemperatureSensor item)
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
                LogAdd(item, "UserGreenhouseHall Related By this TemperatureSensor Not Found", ex);
                throw ex;
            }
            await ValidateOnAddAsync(item);
            var g = await _baseRepo.InsertAsync(new TemperatureSensorEntity(item));
            try
            {
                await _unitOfWork.CommitAsync();
                LogAdd(item, "Successfully add item with ,ID:" +
                  g.ID.ToString() +
                  " ,TemperatureSensorName:" + item.TemperatureSensorName
                 );
                await _temperatureSensorDetailService.AddAsync(new TemperatureSensorDetail
                {
                    TemperatureSensorID = g.ID,
                    TemperatureValue = 0,
                    LastModifiedBy = item.LastModifiedBy,
                    LastModificationTime = item.LastModificationTime,
                });
                return g.ID;
            }
            catch (Exception ex)
            {
                LogAdd(item, "TemperatureSensorName :" + item.TemperatureSensorName, ex);
                throw new ServiceStorageException("Error adding TemperatureSensorName", ex);
            }
        }

        public async Task<LinqDataResult<TemperatureSensorViewEntity>> ItemsAsync(LinqDataRequest request, string UserName)
        {
            try
            {
                return await _unitOfWork.TemperatureSensors.GetTemperatureSensorsByGreenhouseHall(request, UserName);
            }
            catch (Exception ex)
            {
                throw new ServiceStorageException("Error loading TemperatureSensor", ex);
            }
        }

        public async override Task ModifyAsync(TemperatureSensor item)
        {
            if (item == null)
            {
                var exception = new ServiceArgumentNullException(typeof(TemperatureSensor).Name);
                LogModify(item, null, exception);
                throw exception;
            }

            var UserGreenhouseHall = await _unitOfWork.UserGreenhouseHalls.FirstOrDefaultAsync(uu => uu.ID == item.GreenhouseHallID);
            if (UserGreenhouseHall == null)
            {
                var ex = new ServiceObjectNotFoundException(nameof(UserGreenhouseHall) + " Not Found");
                LogAdd(item, "UserGreenhouseHall Related By this TemperatureSensor Not Found", ex);
                throw ex;
            }

            var repo = _unitOfWork.GetRepo<TemperatureSensor, int>();
            var currentItem = await repo.GetByIdAsync(item.ID);

            if (currentItem == null)
            {
                var noObj = new ServiceObjectNotFoundException(typeof(TemperatureSensor).Name + " Not Found");
                LogModify(item, null, noObj);
                throw noObj;
            }

            await ValidateOnModifyAsync(item, currentItem);

            currentItem.LastModifiedBy = item.LastModifiedBy;
            currentItem.LastModificationTime = item.LastModificationTime;

            currentItem.TemperatureSensorName = item.TemperatureSensorName;
            currentItem.GreenhouseHallID = item.GreenhouseHallID;
            try
            {
                await _unitOfWork.CommitAsync();
                LogModify(item, "Successfully modified item with ,ID:" +
                   item.ID.ToString() +
                   " ,TemperatureSensorName:" + item.TemperatureSensorName
                 );
            }

            catch (Exception ex)
            {
                LogModify(item, "TemperatureSensorName :" + currentItem.TemperatureSensorName, ex);
                throw new ServiceStorageException("Error modifying TemperatureSensor", ex);
            }
        }

        public async override Task RemoveByIdAsync(int ID)
        {
            var itemToDelete = await _baseRepo.FirstOrDefaultAsync(ss => ss.ID == ID);

            if (itemToDelete == null)
            {
                var f = new ServiceObjectNotFoundException(nameof(TemperatureSensor) + " not found");
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

        public async override Task<TemperatureSensor> RetrieveByIdAsync(int ID)
        {
            TemperatureSensor? item;
            try
            {
                item = await _baseRepo.FirstOrDefaultAsync(ss => ss.ID == ID);
            }
            catch (Exception ex)
            {
                LogRetrieveSingle(ID, ex);
                throw new ServiceStorageException("Error loading TemperatureSensor", ex);
            }
            if (item == null)
            {
                var f = new ServiceObjectNotFoundException(nameof(TemperatureSensor) + " not found by id");
                LogRetrieveSingle(ID, f);
                throw f;
            }
            LogRetrieveSingle(ID);
            return item;
        }
        public async Task<TemperatureSensorView> RetrieveSensorViewByIdAsync(int ID)
        {
            TemperatureSensorView? item;
            try
            {
                item = await _unitOfWork.TemperatureSensors.GetTemperatureSensorViewsByID(ID);
            }
            catch (Exception ex)
            {
                LogRetrieveSingle(ID, ex);
                throw new ServiceStorageException("Error loading TemperatureSensor", ex);
            }
            if (item == null)
            {
                var f = new ServiceObjectNotFoundException(nameof(TemperatureSensor) + " not found by id");
                LogRetrieveSingle(ID, f);
                throw f;
            }
            LogRetrieveSingle(ID);
            return item;
        }
        public async Task<LinqDataResult<TemperatureSensorViewEntity>> GetTemperatureSensors(LinqDataRequest request, int greenhouseId)
        {
            LinqDataResult<TemperatureSensorViewEntity> item = new LinqDataResult<TemperatureSensorViewEntity>();
            try
            {
                //item.Data = await _unitOfWork.TemperatureSensors.GetTemperatureSensorsByGreenhouseHall(greenhouseId);
            }
            catch (Exception ex)
            {
                throw new ServiceStorageException("Error loading TemperatureSensor", ex);
            }

            return item;
        }

        #region Validation
        protected async override Task ValidateOnAddAsync(TemperatureSensor item)
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

        protected async override Task ValidateOnModifyAsync(TemperatureSensor recievedItem, TemperatureSensor storageItem)
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
        private async Task CommonValidateAsync(List<ModelFieldValidationResult> validationErrors, TemperatureSensor item)
        {
            if (string.IsNullOrEmpty(item.TemperatureSensorName))
            {
                validationErrors.Add(new ModelFieldValidationResult()
                {
                    Code = _logBaseID + 1,
                    FieldName = nameof(item.TemperatureSensorName),
                    ValidationMessage = "The Field Can Not Be Empty"
                });
            }
        }
        #endregion

        public override Task<LinqDataResult<TemperatureSensor>> ItemsAsync(LinqDataRequest request)
        {
            throw new NotImplementedException();
        }

        public int GetCountAllTemperatureSensorByUserName(string userName)
        {
            try
            {
                return _unitOfWork.TemperatureSensors.GetCountAllTemperatureSensorByUserName(userName);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}