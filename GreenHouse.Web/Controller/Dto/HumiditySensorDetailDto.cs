using GreenHouse.Model;

namespace GreenHouse.Web.Controller.Dto
{
    public class HumiditySensorDetailDto
    {
        public HumiditySensorDetailDto()
        {

        }
        public HumiditySensorDetailDto(HumiditySensorDetail model)
        {
            if (model != null)
            {
                HumiditySensorValue = model.HumiditySensorValue;
                HumiditySensorID = model.HumiditySensorID;
            }
        }
        public float HumiditySensorValue { get; set; }
        public int HumiditySensorID { get; set; }
        public HumiditySensorDetail GetHumiditySensorDetail()
        {
            return new HumiditySensorDetail()
            {
                HumiditySensorValue = HumiditySensorValue,
                HumiditySensorID = HumiditySensorID
            };
        }
    }
}
