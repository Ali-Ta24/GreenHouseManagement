using GreenHouse.Model;

namespace GreenHouse.Web.Controller.Dto
{
    public class TemperatureSensorDetailDto
    {
        public TemperatureSensorDetailDto()
        {

        }
        public TemperatureSensorDetailDto(TemperatureSensorDetail model)
        {
            if (model != null)
            {
                TemperatureValue = model.TemperatureValue;
                TemperatureSensorID = model.TemperatureSensorID;
            }
        }
        public float TemperatureValue { get; set; }
        public int TemperatureSensorID { get; set; }
        public TemperatureSensorDetail GetTemperatureSensorDetail()
        {
            return new TemperatureSensorDetail()
            {
                TemperatureValue = TemperatureValue,
                TemperatureSensorID = TemperatureSensorID
            };
        }
    }
}
