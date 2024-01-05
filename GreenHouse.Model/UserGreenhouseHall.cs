using MZBase.Domain;

namespace GreenHouse.Model
{
    public class UserGreenhouseHall : Auditable<int>
    {
        public string? UserID { get; set; }
        public string? HallName { get; set; }
    }
}
