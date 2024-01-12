using GreenHouse.Model;
using System.ComponentModel.DataAnnotations.Schema;

namespace GreenHouse.DomainEntity
{
    [Table("LightIntensitySensor")]
    public class LightIntensitySensorEntity : LightIntensitySensor
    {
        public LightIntensitySensorEntity()
        {

        }
        public LightIntensitySensorEntity(LightIntensitySensor item)
        {
            ID = item.ID;

            GreenhouseHallID = item.GreenhouseHallID;
            LightIntensitySensorName = item.LightIntensitySensorName;

            CreatedBy = item.CreatedBy;
            CreationTime = item.CreationTime;
            LastModifiedBy = item.LastModifiedBy;
            LastModificationTime = item.LastModificationTime;
        }
        [ForeignKey("GreenhouseHallID")]
        public virtual UserGreenhouseHallEntity UserGreenhouseHall { get; set; }
    }
}
