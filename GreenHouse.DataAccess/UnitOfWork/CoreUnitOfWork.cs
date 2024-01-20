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

            TemperatureSensors = new TemperatureSensorRepository(_dbContext);
            LightIntensitySensors = new LightIntensitySensorRepository(_dbContext);
            HumiditySensors = new HumiditySensorRepository(_dbContext);

            TemperatureSensorDetails = new TemperatureSensorDetailRepository(_dbContext);
        }
        public IUserGreenhouseHallRepository UserGreenhouseHalls { get; private set; }
        
        public ITemperatureSensorRepository TemperatureSensors { get; private set; }
        public ILightIntensitySensorRepository LightIntensitySensors { get; private set; }
        public IHumiditySensorRepository HumiditySensors { get; private set; }

        public ITemperatureSensorDetailRepository TemperatureSensorDetails { get; private set; }

        public ILDRCompatibleRepositoryAsync<T, PrimKey> GetRepo<T, PrimKey>()
           where T : Model<PrimKey>
           where PrimKey : struct
        {
            ILDRCompatibleRepositoryAsync<T, PrimKey> ff = null;

            if (typeof(T) == typeof(UserGreenhouseHall))
            {
                ff = UserGreenhouseHalls as ILDRCompatibleRepositoryAsync<T, PrimKey>;
            }

            else if (typeof(T) == typeof(TemperatureSensor))
            {
                ff = TemperatureSensors as ILDRCompatibleRepositoryAsync<T, PrimKey>;
            }
            else if (typeof(T) == typeof(LightIntensitySensor))
            {
                ff = LightIntensitySensors as ILDRCompatibleRepositoryAsync<T, PrimKey>;
            }
            else if (typeof(T) == typeof(HumiditySensor))
            {
                ff = HumiditySensors as ILDRCompatibleRepositoryAsync<T, PrimKey>;
            }

            else if (typeof(T) == typeof(TemperatureSensorDetail))
            {
                ff = TemperatureSensorDetails as ILDRCompatibleRepositoryAsync<T, PrimKey>;
            }
            return ff;
        }
    }
}
