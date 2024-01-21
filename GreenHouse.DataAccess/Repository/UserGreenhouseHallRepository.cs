using GreenHouse.DataAccess.Context;
using GreenHouse.DataAccess.Repository.Interfaces;
using GreenHouse.DomainEntity;
using GreenHouse.DomainEntity.Views;
using GreenHouse.Model;
using MZBase.EntityFrameworkCore;
using MZSimpleDynamicLinq.Core;
using MZSimpleDynamicLinq.EFCoreExtensions;

namespace GreenHouse.DataAccess.Repository
{
    public class UserGreenhouseHallRepository : LDRCompatibleRepositoryAsync<UserGreenhouseHallEntity, UserGreenhouseHall, int>, IUserGreenhouseHallRepository
    {
        private readonly CoreDbContext _dbContext;
        public UserGreenhouseHallRepository(CoreDbContext context) : base(context)
        {
            _dbContext = context;
        }

        public async Task<LinqDataResult<GreenhouseHallViewEntity>> GetAllGreenHouseByUser(LinqDataRequest request, string userName)
            => await _dbContext.GreenhouseHallView
            .Where(ss => ss.UserID == userName)
            .ToLinqDataResultAsync(request.Take, request.Skip, request.Sort, request.Filter);
    }
}
