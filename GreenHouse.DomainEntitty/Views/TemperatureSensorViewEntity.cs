using GreenHouse.Model.Views;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace GreenHouse.DomainEntitty.Views
{
    [Keyless]
    [NotMapped]
    public class TemperatureSensorViewEntity : TemperatureSensorView
    {
    }
}
