using GreenHouse.Model;
using System.ComponentModel.DataAnnotations.Schema;

namespace GreenHouse.DomainEntitty
{
    [Table("TemperatureSensorDetail")]
    public class TemperatureSensorDetailEntity : TemperatureSensorDetail
    {
        public TemperatureSensorDetailEntity()
        {

        }
        public TemperatureSensorDetailEntity(TemperatureSensorDetail item)
        {
            ID = item.ID;

            TemperatureSensorID = item.TemperatureSensorID;
            TemperatureValue = item.TemperatureValue;

            LastModifiedBy = item.LastModifiedBy;
            LastModificationTime = item.LastModificationTime;
        }
        [ForeignKey("TemperatureSensorID")]
        public virtual TemperatureSensorEntity TemperatureSensorEntity { get; set; }
    }
}
