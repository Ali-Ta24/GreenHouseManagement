using System.ComponentModel.DataAnnotations;

namespace GreenHouse.Web.Controller.Model
{
    public class LoginInputModel
    {
        [Required(ErrorMessage = "وارد کردن فیلد نام کاربری ضروری است")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "وارد کردن فیلد رمزعبور ضروری است")]
        public string Password { get; set; }
        public bool RememberLogin { get; set; }
        public string? ReturnUrl { get; set; }
        public string? Username { get; set; }
    }
}
