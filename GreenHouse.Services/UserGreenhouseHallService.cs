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

            //await ValidateOnAddAsync(item);
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
                return (await _unitOfWork.UserGreenhouseHalls.AllItemsAsync()).Where(ss =>ss.UserID == userId).Count();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public override Task<LinqDataResult<UserGreenhouseHall>> ItemsAsync(LinqDataRequest request)
        {
            throw new NotImplementedException();
        }

        public override Task ModifyAsync(UserGreenhouseHall item)
        {
            throw new NotImplementedException();
        }

        public override Task RemoveByIdAsync(int ID)
        {
            throw new NotImplementedException();
        }

        public override Task<UserGreenhouseHall> RetrieveByIdAsync(int ID)
        {
            throw new NotImplementedException();
        }

        #region Validation
        protected override Task ValidateOnAddAsync(UserGreenhouseHall item)
        {
            throw new NotImplementedException();
        }

        protected override Task ValidateOnModifyAsync(UserGreenhouseHall recievedItem, UserGreenhouseHall storageItem)
        {
            throw new NotImplementedException();
        }
        #endregion
    }
}
