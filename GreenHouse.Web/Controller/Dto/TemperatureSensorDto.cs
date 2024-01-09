using GreenHouse.Model;

namespace GreenHouse.Web.Controller.Dto
{
    public class TemperatureSensorDto
    {
        public TemperatureSensorDto()
        {

        }
        public TemperatureSensorDto(TemperatureSensor model)
        {
            if (model != null)
            {
                GreenhouseHallID = model.GreenhouseHallID;
                TemperatureSensorName = model.TemperatureSensorName;
            }
        }
        public int? ID { get; set; }
        public int GreenhouseHallID { get; set; }
        public string TemperatureSensorName { get; set; }

        public TemperatureSensor GetTemperatureSensor()
        {
            return new TemperatureSensor()
            {
                ID = ID ?? 0,
                GreenhouseHallID = GreenhouseHallID,
                TemperatureSensorName = TemperatureSensorName
            };
        }
    }
}
