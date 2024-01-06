using GreenHouse.DataAccess.Context;
using GreenHouse.DataAccess.Repository;
using GreenHouse.DataAccess.Repository.Interfaces;
using GreenHouse.Model;
using MZBase.Domain;
using MZBase.EntityFrameworkCore;
using MZBase.Infrastructure;

namespace GreenHouse.DataAccess.UnitOfWork
{
    public class CoreUnitOfWork : UnitOfWorkAsync<CoreDbContext>, ICoreUnitOfWork
    {
        public CoreUnitOfWork() : base(new CoreDbContext())
        {
            UserGreenhouseHalls = new UserGreenhouseHallRepository(_dbContext);
        }
        public IUserGreenhouseHallRepository UserGreenhouseHalls { get; private set; }

        public ILDRCompatibleRepositoryAsync<T, PrimKey> GetRepo<T, PrimKey>()
           where T : Model<PrimKey>
           where PrimKey : struct
        {
            ILDRCompatibleRepositoryAsync<T, PrimKey> ff = null;

            if (typeof(T) == typeof(UserGreenhouseHall))
            {
                ff = UserGreenhouseHalls as ILDRCompatibleRepositoryAsync<T, PrimKey>;
            }

            return ff;
        }
    }
}
