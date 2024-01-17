using GreenHouse.DomainEntity.Views;
using GreenHouse.Model;
using MZBase.Infrastructure;
using MZSimpleDynamicLinq.Core;

namespace GreenHouse.DataAccess.Repository.Interfaces
{
    public interface ILightIntensitySensorRepository : ILDRCompatibleRepositoryAsync<LightIntensitySensor, int>
    {
        Task<LinqDataResult<LightIntensitySensorViewEntity>> GetLightIntensitySensorsByGreenhouseHall(LinqDataRequest request, int greenhouseId, string userName);
    }
}
