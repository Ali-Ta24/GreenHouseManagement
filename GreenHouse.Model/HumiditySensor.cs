using MZBase.Domain;

namespace GreenHouse.Model
{
    public class HumiditySensor : Auditable<int>
    {
        public int GreenhouseHallID { get; set; }
        public string HumiditySensorName { get; set; }
    }
}
