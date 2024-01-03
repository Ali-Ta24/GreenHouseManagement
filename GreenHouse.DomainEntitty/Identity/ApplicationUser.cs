using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace GreenHouse.DomainEntitty.Identity
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }

        [Required]
        [StringLength(10, ErrorMessageResourceName = null, ErrorMessageResourceType = null, MinimumLength = 10)]
        public string NationalCodeId { get; set; }

        public bool IsActive { get; set; }
        //public ICollection<ProfilePictureUserEntity>? profilePictureUserEntities { get; set; }
        public bool IsDeleted { get; set; }
    }
}