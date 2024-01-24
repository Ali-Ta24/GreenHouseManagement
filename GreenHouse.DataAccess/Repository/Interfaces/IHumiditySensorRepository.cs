using GreenHouse.DomainEntity.Views;
using GreenHouse.Model;
using GreenHouse.Model.Views;
using MZBase.Infrastructure;
using MZSimpleDynamicLinq.Core;

namespace GreenHouse.DataAccess.Repository.Interfaces
{
    public interface IHumiditySensorRepository : ILDRCompatibleRepositoryAsync<HumiditySensor, int>
    {
        Task<HumiditySensorView> GetHumiditySensorViewsByID(int HumiditySensorID);
        Task<LinqDataResult<HumiditySensorViewEntity>> GetHumiditySensorsByGreenhouseHall(LinqDataRequest request, string userName);
        int GetCountAllHumiditySensorByUserName(string UserName);
    }
}
