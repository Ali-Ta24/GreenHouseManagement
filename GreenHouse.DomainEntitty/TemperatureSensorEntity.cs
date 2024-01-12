using GreenHouse.Model;
using System.ComponentModel.DataAnnotations.Schema;

namespace GreenHouse.DomainEntity
{
    [Table("TemperatureSensor")]
    public class TemperatureSensorEntity : TemperatureSensor
    {
        public TemperatureSensorEntity()
        {

        }
        public TemperatureSensorEntity(TemperatureSensor item)
        {
            ID = item.ID;

            GreenhouseHallID = item.GreenhouseHallID;
            TemperatureSensorName = item.TemperatureSensorName;

            CreatedBy = item.CreatedBy;
            CreationTime = item.CreationTime;
            LastModifiedBy = item.LastModifiedBy;
            LastModificationTime = item.LastModificationTime;
        }
        [ForeignKey("GreenhouseHallID")]
        public virtual UserGreenhouseHallEntity UserGreenhouseHall { get; set; }
    }
}
