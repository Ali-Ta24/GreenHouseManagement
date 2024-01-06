using GreenHouse.DataAccess.Repository.Interfaces;
using GreenHouse.DomainEntitty;
using GreenHouse.Model;
using GreenHouse.Web.Context;
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
