using GreenHouse.DataAccess.Context;
using GreenHouse.DataAccess.Repository.Interfaces;
using GreenHouse.DomainEntitty;
using GreenHouse.DomainEntity.Views;
using GreenHouse.Model;
using Microsoft.EntityFrameworkCore;
using MZBase.EntityFrameworkCore;

namespace GreenHouse.DataAccess.Repository
{
    public class TemperatureSensorRepository : LDRCompatibleRepositoryAsync<TemperatureSensorEntity, TemperatureSensor, int>, ITemperatureSensorRepository
    {
        private readonly CoreDbContext _dbContext;
        public TemperatureSensorRepository(CoreDbContext context) : base(context)
        {
            _dbContext = context;
        }

        public async Task<IEnumerable<TemperatureSensorViewEntity>> GetTemperatureSensorsByGreenhouseHall(int greenhouseId)    
            => await _dbContext.TemperatureSensorView.Where(ss => ss.GreenhouseHallID == greenhouseId).ToListAsync();
    }
}