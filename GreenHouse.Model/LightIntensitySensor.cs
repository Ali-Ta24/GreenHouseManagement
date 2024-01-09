using MZBase.Domain;

namespace GreenHouse.Model
{
    public class LightIntensitySensor : Auditable<int>
    {
        public int GreenhouseHallID { get; set; }
        public string LightIntensitySensorName { get; set; }
    }
}