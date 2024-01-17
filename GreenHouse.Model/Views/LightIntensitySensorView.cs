namespace GreenHouse.Model.Views
{
    public class LightIntensitySensorView
    {
        public int ID { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreationTime { get; set; }
        public string LastModifiedBy { get; set; }
        public DateTime LastModificationTime { get; set; }
        public string LightIntensitySensorName { get; set; }
        public string HallName { get; set; }
        public int GreenhouseHallID { get; set; }
        public string UserName { get; set; }
    }
}
