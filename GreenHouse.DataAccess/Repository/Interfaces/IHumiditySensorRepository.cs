using GreenHouse.DomainEntity.Views;
using GreenHouse.Model;
using MZBase.Infrastructure;
using MZSimpleDynamicLinq.Core;

namespace GreenHouse.DataAccess.Repository.Interfaces
{
    public interface IHumiditySensorRepository : ILDRCompatibleRepositoryAsync<HumiditySensor, int>
    {
        Task<LinqDataResult<HumiditySensorViewEntity>> GetHumiditySensorsByGreenhouseHall(LinqDataRequest request, int greenhouseId, string userName);
    }
}
