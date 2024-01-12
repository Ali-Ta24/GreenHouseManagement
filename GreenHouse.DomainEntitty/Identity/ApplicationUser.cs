using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace GreenHouse.DomainEntity.Identity
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }

        [Required]
        [StringLength(25, ErrorMessageResourceName = null, ErrorMessageResourceType = null, MinimumLength = 4)]
        public override string UserName { get; set; }

        public bool IsActive { get; set; }
        //public ICollection<ProfilePictureUserEntity>? profilePictureUserEntities { get; set; }
        public bool IsDeleted { get; set; }
    }
}