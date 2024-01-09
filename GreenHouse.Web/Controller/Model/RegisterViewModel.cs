using System.ComponentModel.DataAnnotations;

namespace GreenHouse.Web.Controller.Model
{
    public class RegisterViewModel
    {
        public string? Username { get; set; }

        [Required(ErrorMessage = "وارد کردن نام اجباری است")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "وارد کردن نام خانوادگی اجباری است")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "وارد کردن رمز عبور اجباری است")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "رمز و تکرار رمز عبور همخوانی ندارند")]
        [Required(ErrorMessage = "وارد کردن تکرار رمز عبور اجباری است")]
        public string? ConfirmPassword { get; set; }

        [StringLength(11, ErrorMessage = "لطفا یک شماره تلفن معتبر وارد کنید", ErrorMessageResourceName = null, ErrorMessageResourceType = null, MinimumLength = 11)]
        [Required(ErrorMessage = "وارد کردن شماره تلفن همراه اجباری است")]
        public string PhoneNumber { get; set; }

        public string? ReturnUrl { get; set; }
        public string? RoleName { get; set; }
        //public string CaptchaCode { get; set; }
        public string? OneTimePassword { get; set; }


        public bool AllowRememberLogin { get; set; } = true;
        public bool EnableLocalLogin { get; set; } = true;

        public IEnumerable<ExternalProvider> ExternalProviders { get; set; } = Enumerable.Empty<ExternalProvider>();
        public IEnumerable<ExternalProvider> VisibleExternalProviders => ExternalProviders.Where(x => !String.IsNullOrWhiteSpace(x.DisplayName));

        //public bool IsExternalLoginOnly => EnableLocalLogin == false && ExternalProviders?.Count() == 1;
        //public string ExternalLoginScheme => IsExternalLoginOnly ? ExternalProviders?.SingleOrDefault()?.AuthenticationScheme : null;
    }
}
