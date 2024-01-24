using GreenHouse.DomainEntity.Views;
using GreenHouse.Model;
using GreenHouse.Model.Views;
using MZBase.Infrastructure;
using MZSimpleDynamicLinq.Core;

namespace GreenHouse.DataAccess.Repository.Interfaces
{
    public interface ITemperatureSensorRepository : ILDRCompatibleRepositoryAsync<TemperatureSensor, int>
    {
        int GetCountAllTemperatureSensorByUserName(string UserName);
        Task<LinqDataResult<TemperatureSensorViewEntity>> GetTemperatureSensorsByGreenhouseHall(LinqDataRequest request, string userName);
        Task<TemperatureSensorView> GetTemperatureSensorViewsByID(int TemperatureSensorID);
    }
}
