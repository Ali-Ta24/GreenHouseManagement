using GreenHouse.Model;

namespace GreenHouse.Web.Controller.Dto
{
    public class UserGreenhouseHallDto
    {
        public UserGreenhouseHallDto()
        {

        }
        public UserGreenhouseHallDto(UserGreenhouseHall model)
        {
            if (model != null)
            {
                UserID = model.UserID;
                HallName = model.HallName;
            }
        }
        public int? ID { get; set; }
        public string? UserID { get; set; }
        public string? HallName { get; set; }

        public UserGreenhouseHall GetUserGreenhouseHall()
        {
            return new UserGreenhouseHall()
            {
                ID = ID.Value,
                UserID = UserID,
                HallName = HallName
            };
        }
    }
}
