using GreenHouse.Model;
using MZBase.Infrastructure;

namespace GreenHouse.DataAccess.Repository.Interfaces
{
    public interface ILightIntensitySensorDetailRepository : ILDRCompatibleRepositoryAsync<LightIntensitySensorDetail, long>
    {
        Task<IEnumerable<LightIntensitySensorDetail>> GetLightIntensitySensorDetailsByLightIntensitySensor(int LightIntensitySensorID);
    }
}
