using GreenHouse.Model;

namespace GreenHouse.Web.Controller.Dto
{
    public class LightIntensitySensorDto
    {
        public LightIntensitySensorDto()
        {

        }
        public LightIntensitySensorDto(LightIntensitySensor model)
        {
            if (model != null)
            {
                GreenhouseHallID = model.GreenhouseHallID;
                LightIntensitySensorName = model.LightIntensitySensorName;
            }
        }
        public int? ID { get; set; }
        public int GreenhouseHallID { get; set; }
        public string LightIntensitySensorName { get; set; }

        public LightIntensitySensor GetLightIntensitySensor()
        {
            return new LightIntensitySensor()
            {
                ID = ID ?? 0,
                GreenhouseHallID = GreenhouseHallID,
                LightIntensitySensorName = LightIntensitySensorName
            };
        }
    }
}
