﻿using GreenHouse.DataAccess.Context;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenHouse.DataAccess
{
    public class IdentityDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            optionsBuilder.UseSqlServer("Server=.;Database=GreenHouse;User Id=sa;password=1qaz@WSX;TrustServerCertificate=True;MultipleActiveResultSets=true");

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}