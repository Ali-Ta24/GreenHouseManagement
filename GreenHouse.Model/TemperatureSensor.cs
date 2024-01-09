using MZBase.Domain;

namespace GreenHouse.Model
{
    public class TemperatureSensor : Auditable<int>
    {
        public int GreenhouseHallID { get; set; }
        public string TemperatureSensorName { get; set; }
    }
}
