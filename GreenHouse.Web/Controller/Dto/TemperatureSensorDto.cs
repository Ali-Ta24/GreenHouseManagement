using GreenHouse.Model;
using GreenHouse.Model.Views;

namespace GreenHouse.Web.Controller.Dto
{
    public class TemperatureSensorDto
    {
        public int? ID { get; set; }
        public int? GreenhouseHallID { get; set; }
        public string TemperatureSensorName { get; set; }
        public float? TemperatureValue { get; set; }
        public bool SensorChanged { get; set; }
        public TemperatureSensor TemperatureSensorAddDto()
        {
            return new TemperatureSensor()
            {
                GreenhouseHallID = GreenhouseHallID.Value,
                TemperatureSensorName = TemperatureSensorName
            };
        }
        public TemperatureSensor TemperatureSensorModifyDto()
        {
            return new TemperatureSensor()
            {
                ID = ID.Value,
                GreenhouseHallID = GreenhouseHallID.Value,
                TemperatureSensorName = TemperatureSensorName
            };
        }
        public TemperatureSensorDetail TemperatureSensorGetDto()
        {
            return new TemperatureSensorDetail()
            {
                TemperatureSensorID = ID.Value,
                TemperatureValue = TemperatureValue.Value
            };
        }
    }
}
