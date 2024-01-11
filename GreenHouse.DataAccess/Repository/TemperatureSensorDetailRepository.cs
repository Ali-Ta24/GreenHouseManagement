using GreenHouse.DataAccess.Context;
using GreenHouse.DataAccess.Repository.Interfaces;
using GreenHouse.DomainEntitty;
using GreenHouse.Model;
using Microsoft.EntityFrameworkCore;
using MZBase.EntityFrameworkCore;

namespace GreenHouse.DataAccess.Repository
{
    public class TemperatureSensorDetailRepository : LDRCompatibleRepositoryAsync<TemperatureSensorDetailEntity, TemperatureSensorDetail, long>, ITemperatureSensorDetailRepository
    {
        private readonly CoreDbContext _dbContext;
        public TemperatureSensorDetailRepository(CoreDbContext context) : base(context)
        {
            _dbContext = context;
        }

        public async Task<IEnumerable<TemperatureSensorDetail>> GetTemperatureSensorDetailsByTemperatureSensor(int TemperatureSensorID)
            => await _dbContext.TemperatureSensorDetail.Where(ss => ss.ID == TemperatureSensorID).ToListAsync();
    }
}