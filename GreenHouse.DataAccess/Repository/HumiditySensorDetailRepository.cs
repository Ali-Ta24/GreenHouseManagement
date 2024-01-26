using GreenHouse.DataAccess.Context;
using GreenHouse.DataAccess.Repository.Interfaces;
using GreenHouse.DomainEntity;
using GreenHouse.Model;
using Microsoft.EntityFrameworkCore;
using MZBase.EntityFrameworkCore;

namespace GreenHouse.DataAccess.Repository
{
    public class HumiditySensorDetailRepository : LDRCompatibleRepositoryAsync<HumiditySensorDetailEntity, HumiditySensorDetail, long>, IHumiditySensorDetailRepository
    {
        private readonly CoreDbContext _dbContext;
        public HumiditySensorDetailRepository(CoreDbContext context) : base(context)
        {
            _dbContext = context;
        }

        public async Task<IEnumerable<HumiditySensorDetail>> GetHumiditySensorDetailsByHumiditySensor(int HumiditySensorID)
            => await _dbContext.HumiditySensorDetail.Where(ss => ss.HumiditySensorID == HumiditySensorID).ToListAsync();
    }
}