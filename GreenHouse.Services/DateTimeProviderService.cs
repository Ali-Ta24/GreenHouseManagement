using MZBase.Infrastructure;

namespace GreenHouse.Services
{
    public class DateTimeProviderService : IDateTimeProviderService
    {
        public DateTime GetNow()
        {
            return DateTime.Now;
        }
    }
}