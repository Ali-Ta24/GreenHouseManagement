using GreenHouse.Model.Views;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace GreenHouse.DomainEntity.Views
{
    [Keyless]
    [NotMapped]
    public class GreenhouseHallViewEntity : GreenhouseHallView
    {
    }
}
