using GreenHouse.Model;

namespace GreenHouse.Web.Controller.Dto
{
    public class HumiditySensorDto
    {
        public HumiditySensorDto()
        {

        }
        public HumiditySensorDto(HumiditySensor model)
        {
            if (model != null)
            {
                GreenhouseHallID = model.GreenhouseHallID;
                HumiditySensorName = model.HumiditySensorName;
            }
        }
        public int? ID { get; set; }
        public int GreenhouseHallID { get; set; }
        public string HumiditySensorName { get; set; }

        public HumiditySensor GetHumiditySensor()
        {
            return new HumiditySensor()
            {
                ID = ID ?? 0,
                GreenhouseHallID = GreenhouseHallID,
                HumiditySensorName = HumiditySensorName
            };
        }
    }
}
