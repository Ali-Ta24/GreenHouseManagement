using System.ComponentModel.DataAnnotations;

namespace GreenHouse.Web.Controller.Model
{
    public class RegisterOtpViewModel
    {
        public string? OneTimePassword { get; set; }
        public string? ReturnUrl { get; set; }
        public bool? ConfirmPhoneNumber { get; set; }
        //public string? Password { get; set; }

        [Required(ErrorMessage = "ایدی کاربر یافت نشد")]
        public string UserId { get; set; }
    }
}
