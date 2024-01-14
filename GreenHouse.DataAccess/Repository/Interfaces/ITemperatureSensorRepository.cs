using GreenHouse.DomainEntity.Views;
using GreenHouse.Model;
using MZBase.Infrastructure;
using MZSimpleDynamicLinq.Core;

namespace GreenHouse.DataAccess.Repository.Interfaces
{
    public interface ITemperatureSensorRepository : ILDRCompatibleRepositoryAsync<TemperatureSensor, int>
    {
        Task<LinqDataResult<TemperatureSensorViewEntity>> GetTemperatureSensorsByGreenhouseHall(LinqDataRequest request,int greenhouseId, string userName);
    }
}
