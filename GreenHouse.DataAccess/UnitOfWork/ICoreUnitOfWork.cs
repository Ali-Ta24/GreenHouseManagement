using GreenHouse.DataAccess.Repository.Interfaces;
using MZBase.Infrastructure;

namespace GreenHouse.DataAccess.UnitOfWork
{
    public interface ICoreUnitOfWork : IDynamicTestableUnitOfWorkAsync
    {
        IUserGreenhouseHallRepository UserGreenhouseHalls { get; }
        ITemperatureSensorRepository TemperatureSensors { get; }
        ITemperatureSensorDetailRepository TemperatureSensorDetails { get; }
    }
}
