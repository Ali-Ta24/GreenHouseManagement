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
    public class UserGreenhouseHallService : StorageBusinessService<UserGreenhouseHall, int>
    {
        private readonly ICoreUnitOfWork _unitOfWork;
        private readonly ILDRCompatibleRepositoryAsync<UserGreenhouseHall, int> _baseRepo;

        public UserGreenhouseHallService(ICoreUnitOfWork eMSUnitOfWork, ILogger<UserGreenhouseHall> logger, IDateTimeProviderService dateTimeProvider)
            : base(logger, dateTimeProvider, 100)
        {
            _unitOfWork = eMSUnitOfWork;
            _baseRepo = _unitOfWork.GetRepo<UserGreenhouseHall, int>();
        }

        public async override Task<int> AddAsync(UserGreenhouseHall item)
        {
            if (item == null)
            {
                var ex = new ServiceArgumentNullException("Input parameter was null:" + nameof(item));
                LogAdd(null, null, ex);
                throw ex;
            }

            await ValidateOnAddAsync(item);
            var g = await _baseRepo.InsertAsync(new UserGreenhouseHallEntity(item));
            try
            {
                await _unitOfWork.CommitAsync();
                LogAdd(item, "Successfully add item with ,ID:" +
                  g.ID.ToString() +
                  " ,Title:" + item.HallName
                 );
                return g.ID;
            }
            catch (Exception ex)
            {
                LogAdd(item, "Title :" + item.HallName, ex);
                throw new ServiceStorageException("Error adding UserGreenhouseHall", ex);
            }
        }

        public async Task<IEnumerable<UserGreenhouseHall>> GetAllGreenHouseByUser(string userId)
        {
            return (await _unitOfWork.UserGreenhouseHalls.AllItemsAsync()).Where(ss => ss.UserID == userId);
        }

        public async Task<int> GetCountAllGreenhouseHallByUserName(string userId)
        {
            try
            {
                return (await _unitOfWork.UserGreenhouseHalls.AllItemsAsync()).Where(ss => ss.UserID == userId).Count();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async override Task ModifyAsync(UserGreenhouseHall item)
        {
            if (item == null)
            {
                var exception = new ServiceArgumentNullException(typeof(UserGreenhouseHall).Name);
                LogModify(item, null, exception);
                throw exception;
            }

            var repo = _unitOfWork.GetRepo<UserGreenhouseHall, int>();
            var currentItem = await repo.GetByIdAsync(item.ID);

            if (currentItem == null)
            {
                var noObj = new ServiceObjectNotFoundException(typeof(UserGreenhouseHall).Name + " Not Found");
                LogModify(item, null, noObj);
                throw noObj;
            }

            await ValidateOnModifyAsync(item, currentItem);

            currentItem.LastModifiedBy = item.LastModifiedBy;
            currentItem.LastModificationTime = item.LastModificationTime;

            currentItem.HallName = item.HallName;
            try
            {
                await _unitOfWork.CommitAsync();
                LogModify(item, "Successfully modified item with ,ID:" +
                   item.ID.ToString() +
                   " ,HallName:" + item.HallName
                 );
            }
            catch (Exception ex)
            {
                LogModify(item, "HallName :" + currentItem.HallName, ex);
                throw new ServiceStorageException("Error modifying UserGreenhouseHall", ex);
            }
        }

        public async override Task RemoveByIdAsync(int ID)
        {
            var itemToDelete = await _baseRepo.FirstOrDefaultAsync(ss => ss.ID == ID);

            if (itemToDelete == null)
            {
                var f = new ServiceObjectNotFoundException(nameof(UserGreenhouseHall) + " not found");
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

        public async Task<LinqDataResult<GreenhouseHallViewEntity>> GetAllGreenHouseByUserId(LinqDataRequest request, string userId)
        {
            try
            {
                return await _unitOfWork.UserGreenhouseHalls.GetAllGreenHouseByUser(request, userId);
            }
            catch (Exception ex)
            {
                throw new ServiceStorageException("Error loading GreenHouse", ex);
            }
        }

        public async override Task<UserGreenhouseHall> RetrieveByIdAsync(int ID)
        {
            UserGreenhouseHall? item;
            try
            {
                item = await _baseRepo.FirstOrDefaultAsync(ss => ss.ID == ID);
            }
            catch (Exception ex)
            {
                LogRetrieveSingle(ID, ex);
                throw new ServiceStorageException("Error loading UserGreenhouseHall", ex);
            }
            if (item == null)
            {
                var f = new ServiceObjectNotFoundException(nameof(UserGreenhouseHall) + " not found by id");
                LogRetrieveSingle(ID, f);
                throw f;
            }
            LogRetrieveSingle(ID);
            return item;
        }
        #region Validation
        protected async override Task ValidateOnAddAsync(UserGreenhouseHall item)
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

        protected async override Task ValidateOnModifyAsync(UserGreenhouseHall recievedItem, UserGreenhouseHall storageItem)
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
        private async Task CommonValidateAsync(List<ModelFieldValidationResult> validationErrors, UserGreenhouseHall item)
        {
            if (string.IsNullOrEmpty(item.HallName))
            {
                validationErrors.Add(new ModelFieldValidationResult()
                {
                    Code = _logBaseID + 1,
                    FieldName = nameof(item.HallName),
                    ValidationMessage = "The Field Can Not Be Empty"
                });
            }
        }
        #endregion


        public override Task<LinqDataResult<UserGreenhouseHall>> ItemsAsync(LinqDataRequest request)
        {
            throw new NotImplementedException();
        }
    }
}
