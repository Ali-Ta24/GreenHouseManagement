using GreenHouse.Model;

namespace GreenHouse.Web.Controller.Dto
{
    public class TemperatureSensorDateilDto
    {
        public TemperatureSensorDateilDto()
        {

        }
        public TemperatureSensorDateilDto(TemperatureSensorDetail model)
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
