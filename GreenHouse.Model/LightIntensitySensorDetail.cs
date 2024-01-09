using MZBase.Domain;

namespace GreenHouse.Model
{
    public class LightIntensitySensorDetail : Model<long>
    {
        public int LightIntensitySensorID { get; set; }
        public float LightIntensitySensorValue { get; set; }
        public string LastModifiedBy { get; set; }
        public DateTime LastModificationTime { get; set; }
    }
}
