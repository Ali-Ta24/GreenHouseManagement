using GreenHouse.DomainEntity.Views;
using GreenHouse.Model;
using MZBase.Infrastructure;

namespace GreenHouse.DataAccess.Repository.Interfaces
{
    public interface ITemperatureSensorRepository : ILDRCompatibleRepositoryAsync<TemperatureSensor, int>
    {
        Task<IEnumerable<TemperatureSensorViewEntity>> GetTemperatureSensorsByGreenhouseHall(int greenhouseId);
    }
}
