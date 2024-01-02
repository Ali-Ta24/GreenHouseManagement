using System.ComponentModel.DataAnnotations;

namespace GreenHouse.Web.Controller.Model
{
    public class LoginInputModel
    {
        [Required(ErrorMessage = "وارد کردن فیلد کد ملی ضروری است")]
        public string NationalCodeId { get; set; }

        [Required(ErrorMessage = "وارد کردن فیلد رمزعبور ضروری است")]
        public string Password { get; set; }
        public bool RememberLogin { get; set; }
        public string? ReturnUrl { get; set; }
        public string? Username { get; set; }
    }
}
