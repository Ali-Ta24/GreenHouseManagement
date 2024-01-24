using GreenHouse.Model;

namespace GreenHouse.Web.Controller.Dto
{
    public class LightIntensitySensorDto
    {
        public int? ID { get; set; }
        public int? GreenhouseHallID { get; set; }
        public string LightIntensitySensorName { get; set; }
        public float? LightIntensitySensorValue { get; set; }
        public bool SensorChanged { get; set; }
        public LightIntensitySensor LightIntensitySensorAddDto()
        {
            return new LightIntensitySensor()
            {
                GreenhouseHallID = GreenhouseHallID.Value,
                LightIntensitySensorName = LightIntensitySensorName
            };
        }
        public LightIntensitySensor LightIntensitySensorModifyDto()
        {
            return new LightIntensitySensor()
            {
                ID = ID.Value,
                GreenhouseHallID = GreenhouseHallID.Value,
                LightIntensitySensorName = LightIntensitySensorName
            };
        }
        public LightIntensitySensorDetail LightIntensitySensorGetDto()
        {
            return new LightIntensitySensorDetail()
            {
                LightIntensitySensorID = ID.Value,
                LightIntensitySensorValue = LightIntensitySensorValue.Value
            };
        }
    }
}
