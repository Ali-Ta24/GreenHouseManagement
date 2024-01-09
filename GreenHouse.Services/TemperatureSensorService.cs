using GreenHouse.DataAccess.UnitOfWork;
using GreenHouse.Model;
using Microsoft.Extensions.Logging;
using MZBase.Infrastructure;
using MZBase.Infrastructure.Service;
using MZBase.Infrastructure.Service.Exceptions;
using MZSimpleDynamicLinq.Core;

namespace GreenHouse.Services
{
    public class TemperatureSensorService : StorageBusinessService<TemperatureSensor, int>
    {
        private readonly ICoreUnitOfWork _unitOfWork;
        private readonly ILDRCompatibleRepositoryAsync<TemperatureSensor, int> _baseRepo;

        public TemperatureSensorService(ICoreUnitOfWork eMSUnitOfWork, ILogger<TemperatureSensor> logger, IDateTimeProviderService dateTimeProvider)
            : base(logger, dateTimeProvider, 200)
        {
            _unitOfWork = eMSUnitOfWork;
            _baseRepo = _unitOfWork.GetRepo<TemperatureSensor, int>();
        }

        public override Task<int> AddAsync(TemperatureSensor item)
        {
            throw new NotImplementedException();
        }

        public override Task<LinqDataResult<TemperatureSensor>> ItemsAsync(LinqDataRequest request)
        {
            throw new NotImplementedException();
        }

        public override Task ModifyAsync(TemperatureSensor item)
        {
            throw new NotImplementedException();
        }

        public override Task RemoveByIdAsync(int ID)
        {
            throw new NotImplementedException();
        }

        public override Task<TemperatureSensor> RetrieveByIdAsync(int ID)
        {
            throw new NotImplementedException();
        }

        public async Task<LinqDataResult<TemperatureSensor>> GetTemperatureSensors(LinqDataRequest request, int greenhouseId)
        {
            LinqDataResult<TemperatureSensor> item = new LinqDataResult<TemperatureSensor>();
            try
            {
                item.Data = await _unitOfWork.TemperatureSensors.GetTemperatureSensorsByGreenhouseHall(greenhouseId);
            }
            catch (Exception ex)
            {
                throw new ServiceStorageException("Error loading Ageda", ex);
            }

            return item;
        }

        protected override Task ValidateOnAddAsync(TemperatureSensor item)
        {
            throw new NotImplementedException();
        }

        protected override Task ValidateOnModifyAsync(TemperatureSensor recievedItem, TemperatureSensor storageItem)
        {
            throw new NotImplementedException();
        }
    }
}