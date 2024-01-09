using MZBase.Domain;

namespace GreenHouse.Model
{
    public class TemperatureSensorDetail : Model<long>
    {
        public int TemperatureSensorID { get; set; }
        public float TemperatureValue { get; set; }
        public string LastModifiedBy { get; set; }
        public DateTime LastModificationTime { get; set; }
    }
}
