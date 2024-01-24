using GreenHouse.DataAccess.Context;
using GreenHouse.DataAccess.Repository.Interfaces;
using GreenHouse.DomainEntity;
using GreenHouse.DomainEntity.Views;
using GreenHouse.Model;
using GreenHouse.Model.Views;
using Microsoft.EntityFrameworkCore;
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

        public int GetCountAllTemperatureSensorByUserName(string UserName)
            => _dbContext.TemperatureSensorView.Where(ss => ss.UserName == UserName).Count();


        public async Task<LinqDataResult<TemperatureSensorViewEntity>> GetTemperatureSensorsByGreenhouseHall(LinqDataRequest request, string userName)
            => await _dbContext.TemperatureSensorView
            .Where(ss => ss.UserName == userName)
            .ToLinqDataResultAsync(request.Take, request.Skip, request.Sort, request.Filter);

        public async Task<TemperatureSensorView> GetTemperatureSensorViewsByID(int TemperatureSensorID)
            => await _dbContext.TemperatureSensorView.FirstOrDefaultAsync(ss => ss.ID == TemperatureSensorID);
    }
}