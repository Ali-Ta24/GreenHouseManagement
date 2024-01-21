using GreenHouse.DomainEntity.Views;
using GreenHouse.Model;
using MZBase.Infrastructure;
using MZSimpleDynamicLinq.Core;
namespace GreenHouse.DataAccess.Repository.Interfaces
{
    public interface IUserGreenhouseHallRepository : ILDRCompatibleRepositoryAsync<UserGreenhouseHall, int>
    {
        Task<LinqDataResult<GreenhouseHallViewEntity>> GetAllGreenHouseByUser(LinqDataRequest request, string userName);
    }
}
