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
    public class HumiditySensorRepository : LDRCompatibleRepositoryAsync<HumiditySensorEntity, HumiditySensor, int>, IHumiditySensorRepository
    {
        private readonly CoreDbContext _dbContext;
        public HumiditySensorRepository(CoreDbContext context) : base(context)
        {
            _dbContext = context;
        }

        public async Task<LinqDataResult<HumiditySensorViewEntity>> GetHumiditySensorsByGreenhouseHall(LinqDataRequest request, int greenhouseId, string userName)
            => await _dbContext.HumiditySensorView
            .Where(ss => ss.GreenhouseHallID == greenhouseId && ss.UserName == userName)
            .ToLinqDataResultAsync(request.Take, request.Skip, request.Sort, request.Filter);
    }
}