using GreenHouse.Model;

namespace GreenHouse.Web.Controller.Dto
{
    public class HumiditySensorDto
    {
        public int? ID { get; set; }
        public int? GreenhouseHallID { get; set; }
        public string HumiditySensorName { get; set; }
        public float? HumiditySensorValue { get; set; }
        public bool SensorChanged { get; set; }
        public HumiditySensor HumiditySensorAddDto()
        {
            return new HumiditySensor()
            {
                GreenhouseHallID = GreenhouseHallID.Value,
                HumiditySensorName = HumiditySensorName
            };
        }
        public HumiditySensor HumiditySensorModifyDto()
        {
            return new HumiditySensor()
            {
                ID = ID.Value,
                GreenhouseHallID = GreenhouseHallID.Value,
                HumiditySensorName = HumiditySensorName
            };
        }
        public HumiditySensorDetail HumiditySensorGetDto()
        {
            return new HumiditySensorDetail()
            {
                HumiditySensorID = ID.Value,
                HumiditySensorValue = HumiditySensorValue.Value
            };
        }
    }
}
