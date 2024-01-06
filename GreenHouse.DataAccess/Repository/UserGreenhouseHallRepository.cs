using GreenHouse.DataAccess.Context;
using GreenHouse.DataAccess.Repository.Interfaces;
using GreenHouse.DomainEntitty;
using GreenHouse.Model;
using MZBase.EntityFrameworkCore;

namespace GreenHouse.DataAccess.Repository
{
    public class UserGreenhouseHallRepository : LDRCompatibleRepositoryAsync<UserGreenhouseHallEntity, UserGreenhouseHall, int>, IUserGreenhouseHallRepository
    {
        private readonly CoreDbContext _dbContext;
        public UserGreenhouseHallRepository(CoreDbContext context) : base(context)
        {
            _dbContext = context;
        }
    }
}
