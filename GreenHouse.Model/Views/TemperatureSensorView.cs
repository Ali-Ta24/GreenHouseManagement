namespace GreenHouse.Model.Views
{
    public class TemperatureSensorView
    {
        public int ID { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreationTime { get; set; }
        public string LastModifiedBy { get; set; }
        public DateTime LastModificationTime { get; set; }
        public string TemperatureSensorName { get; set; }
        public string HallName { get; set; }
        public int GreenhouseHallID { get; set; }
        public string UserName { get; set; }
        public float? TemperatureValue { get; set; }
        public DateTime? LastState { get; set; }
    }
}
