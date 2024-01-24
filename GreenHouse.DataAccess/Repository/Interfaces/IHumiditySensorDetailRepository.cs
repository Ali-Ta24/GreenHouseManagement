using GreenHouse.Model;
using MZBase.Infrastructure;

namespace GreenHouse.DataAccess.Repository.Interfaces
{
    public interface IHumiditySensorDetailRepository : ILDRCompatibleRepositoryAsync<HumiditySensorDetail, long>
    {
        Task<IEnumerable<HumiditySensorDetail>> GetHumiditySensorDetailsByHumiditySensor(int HumiditySensorID);
    }
}
