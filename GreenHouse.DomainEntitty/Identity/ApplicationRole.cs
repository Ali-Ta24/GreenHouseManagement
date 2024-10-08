﻿using Microsoft.AspNetCore.Identity;

namespace GreenHouse.DomainEntity.Identity
{
    public class ApplicationRole : IdentityRole
    {

        public string? TitleMultilang { get; set; }

        public ApplicationRole() : base()
        {

        }

        public ApplicationRole(string name) : base(name)
        {

        }

    }

}
