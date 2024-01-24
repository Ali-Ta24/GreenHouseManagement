using GreenHouse.Model;

namespace GreenHouse.Web.Controller.Dto
{
    public class LightIntensitySensorDetailDto
    {
        public LightIntensitySensorDetailDto()
        {

        }
        public LightIntensitySensorDetailDto(LightIntensitySensorDetail model)
        {
            if (model != null)
            {
                LightIntensitySensorValue = model.LightIntensitySensorValue;
                LightIntensitySensorID = model.LightIntensitySensorID;
            }
        }
        public float LightIntensitySensorValue { get; set; }
        public int LightIntensitySensorID { get; set; }
        public LightIntensitySensorDetail GetLightIntensitySensorDetail()
        {
            return new LightIntensitySensorDetail()
            {
                LightIntensitySensorValue = LightIntensitySensorValue,
                LightIntensitySensorID = LightIntensitySensorID
            };
        }
    }
}
