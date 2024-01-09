using GreenHouse.DataAccess.Context;
using GreenHouse.DataAccess.Repository.Interfaces;
using GreenHouse.DomainEntitty;
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

        public async Task<IEnumerable<TemperatureSensor>> GetTemperatureSensorsByGreenhouseHall(int greenhouseId)    
            => await _dbContext.TemperatureSensor.Where(ss => ss.GreenhouseHallID == greenhouseId).ToListAsync();
    }
}