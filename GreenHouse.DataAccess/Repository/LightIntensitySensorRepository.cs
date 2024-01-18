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
    public class LightIntensitySensorRepository : LDRCompatibleRepositoryAsync<LightIntensitySensorEntity, LightIntensitySensor, int>, ILightIntensitySensorRepository
    {
        private readonly CoreDbContext _dbContext;
        public LightIntensitySensorRepository(CoreDbContext context) : base(context)
        {
            _dbContext = context;
        }

        public async Task<LinqDataResult<LightIntensitySensorViewEntity>> GetLightIntensitySensorsByGreenhouseHall(LinqDataRequest request, int greenhouseId, string userName)
            => await _dbContext.LightIntensitySensorView
            .Where(ss => ss.GreenhouseHallID == greenhouseId && ss.UserName == userName)
            .ToLinqDataResultAsync(request.Take, request.Skip, request.Sort, request.Filter);

        public int GetCountAllLightIntensitySensorByUserName(string UserName)
            => _dbContext.LightIntensitySensorView.Where(ss => ss.UserName == UserName).Count();

    }
}