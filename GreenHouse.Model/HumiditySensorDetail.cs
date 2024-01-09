using MZBase.Domain;

namespace GreenHouse.Model
{
    public class HumiditySensorDetail : Model<long>
    {
        public int HumiditySensorID { get; set; }
        public float HumiditySensorValue { get; set; }
        public string LastModifiedBy { get; set; }
        public DateTime LastModificationTime { get; set; }
    }
}
