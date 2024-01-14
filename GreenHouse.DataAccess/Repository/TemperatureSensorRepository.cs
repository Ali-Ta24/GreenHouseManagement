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
    public class TemperatureSensorRepository : LDRCompatibleRepositoryAsync<TemperatureSensorEntity, TemperatureSensor, int>, ITemperatureSensorRepository
    {
        private readonly CoreDbContext _dbContext;
        public TemperatureSensorRepository(CoreDbContext context) : base(context)
        {
            _dbContext = context;
        }

        public async Task<LinqDataResult<TemperatureSensorViewEntity>> GetTemperatureSensorsByGreenhouseHall(LinqDataRequest request, int greenhouseId, string userName)
            => await _dbContext.TemperatureSensorView
            .Where(ss => ss.GreenhouseHallID == greenhouseId && ss.UserName == userName)
            .ToLinqDataResultAsync(request.Take, request.Skip, request.Sort, request.Filter);
    }
}