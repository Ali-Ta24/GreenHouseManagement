using GreenHouse.Model;
using MZBase.Infrastructure;

namespace GreenHouse.DataAccess.Repository.Interfaces
{
    public interface ITemperatureSensorRepository : ILDRCompatibleRepositoryAsync<TemperatureSensor, int>
    {
        Task<IEnumerable<TemperatureSensor>> GetTemperatureSensorsByGreenhouseHall(int greenhouseId);
    }
}
