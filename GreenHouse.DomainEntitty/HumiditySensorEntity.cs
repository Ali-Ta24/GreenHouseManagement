using GreenHouse.Model;
using System.ComponentModel.DataAnnotations.Schema;

namespace GreenHouse.DomainEntitty
{
    [Table("HumiditySensor")]
    public class HumiditySensorEntity : HumiditySensor
    {
        public HumiditySensorEntity()
        {

        }
        public HumiditySensorEntity(HumiditySensor item)
        {
            ID = item.ID;

            GreenhouseHallID = item.GreenhouseHallID;
            HumiditySensorName = item.HumiditySensorName;

            CreatedBy = item.CreatedBy;
            CreationTime = item.CreationTime;
            LastModifiedBy = item.LastModifiedBy;
            LastModificationTime = item.LastModificationTime;
        }
        [ForeignKey("GreenhouseHallID")]
        public virtual UserGreenhouseHallEntity UserGreenhouseHall { get; set; }
    }
}
