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
    public class AppDbContextFactory : IDesignTimeDbContextFactory<CoreDbContext>
    {
        public CoreDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<CoreDbContext>();
            optionsBuilder.UseSqlServer("Server=.;Database=GreenHouse;User Id=sa;password=1qaz@WSX;TrustServerCertificate=True;MultipleActiveResultSets=true");

            return new CoreDbContext(optionsBuilder.Options);
        }
    }
}