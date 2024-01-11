using GreenHouse.Model;
using MZBase.Infrastructure;

namespace GreenHouse.DataAccess.Repository.Interfaces
{
    public interface ITemperatureSensorDetailRepository : ILDRCompatibleRepositoryAsync<TemperatureSensorDetail, long>
    {
        Task<IEnumerable<TemperatureSensorDetail>> GetTemperatureSensorDetailsByTemperatureSensor(int TemperatureSensorID);
    }
}
