﻿using GreenHouse.DomainEntity.Identity;
using GreenHouse.Model;
using System.ComponentModel.DataAnnotations.Schema;

namespace GreenHouse.DomainEntity
{
    [Table("UserGreenhouseHall")]
    public class UserGreenhouseHallEntity : UserGreenhouseHall
    {
        public UserGreenhouseHallEntity()
        {

        }
        public UserGreenhouseHallEntity(UserGreenhouseHall item)
        {
            ID = item.ID;

            UserID = item.UserID;
            HallName = item.HallName;

            CreatedBy = item.CreatedBy;
            CreationTime = item.CreationTime;
            LastModifiedBy = item.LastModifiedBy;
            LastModificationTime = item.LastModificationTime;
        }
        [ForeignKey("UserID")]
        public virtual ApplicationUser ApplicationUser { get; set; }
    }
}
