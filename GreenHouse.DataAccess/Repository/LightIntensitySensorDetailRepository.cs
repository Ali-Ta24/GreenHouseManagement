using GreenHouse.DataAccess.Context;
using GreenHouse.DataAccess.Repository.Interfaces;
using GreenHouse.DomainEntity;
using GreenHouse.Model;
using Microsoft.EntityFrameworkCore;
using MZBase.EntityFrameworkCore;

namespace GreenHouse.DataAccess.Repository
{
    public class LightIntensitySensorDetailRepository : LDRCompatibleRepositoryAsync<LightIntensitySensorDetailEntity, LightIntensitySensorDetail, long>, ILightIntensitySensorDetailRepository
    {
        private readonly CoreDbContext _dbContext;
        public LightIntensitySensorDetailRepository(CoreDbContext context) : base(context)
        {
            _dbContext = context;
        }

        public async Task<IEnumerable<LightIntensitySensorDetail>> GetLightIntensitySensorDetailsByLightIntensitySensor(int LightIntensitySensorID)
            => await _dbContext.LightIntensitySensorDetail.Where(ss => ss.LightIntensitySensorID == LightIntensitySensorID).ToListAsync();
    }
}