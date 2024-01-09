using GreenHouse.Model;
using System.ComponentModel.DataAnnotations.Schema;

namespace GreenHouse.DomainEntitty
{
    [Table("LightIntensitySensorDetail")]
    public class LightIntensitySensorDetailEntity : LightIntensitySensorDetail
    {
        public LightIntensitySensorDetailEntity()
        {

        }
        public LightIntensitySensorDetailEntity(LightIntensitySensorDetail item)
        {
            ID = item.ID;

            LightIntensitySensorID = item.LightIntensitySensorID;
            LightIntensitySensorValue = item.LightIntensitySensorValue;

            LastModifiedBy = item.LastModifiedBy;
            LastModificationTime = item.LastModificationTime;
        }
        [ForeignKey("LightIntensitySensorID")]
        public virtual LightIntensitySensorEntity LightIntensitySensorEntity { get; set; }
    }
}
