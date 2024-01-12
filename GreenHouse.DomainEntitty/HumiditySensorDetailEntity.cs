using GreenHouse.Model;
using System.ComponentModel.DataAnnotations.Schema;

namespace GreenHouse.DomainEntitty
{
    [Table("HumiditySensorDetail")]
    public class HumiditySensorDetailEntity : HumiditySensorDetail
    {
        public HumiditySensorDetailEntity()
        {

        }
        public HumiditySensorDetailEntity(HumiditySensorDetail item)
        {
            ID = item.ID;

            HumiditySensorID = item.HumiditySensorID;
            HumiditySensorValue = item.HumiditySensorValue;

            LastModifiedBy = item.LastModifiedBy;
            LastModificationTime = item.LastModificationTime;
        }
        [ForeignKey("HumiditySensorID")]
        public virtual HumiditySensorEntity HumiditySensorEntity { get; set; }
    }
}
