using GreenHouse.DataAccess.Repository.Interfaces;
using MZBase.Infrastructure;

namespace GreenHouse.DataAccess.UnitOfWork
{
    public interface ICoreUnitOfWork : IDynamicTestableUnitOfWorkAsync
    {
        IUserGreenhouseHallRepository UserGreenhouseHalls { get; }

        ITemperatureSensorRepository TemperatureSensors { get; }
        ILightIntensitySensorRepository LightIntensitySensors { get; }
        IHumiditySensorRepository HumiditySensors { get; }

        ITemperatureSensorDetailRepository TemperatureSensorDetails { get; }
        ILightIntensitySensorDetailRepository LightIntensitySensorDetails { get; }
        IHumiditySensorDetailRepository HumiditySensorDetails { get; }

    }
}
