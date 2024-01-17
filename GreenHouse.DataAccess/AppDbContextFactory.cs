using GreenHouse.DataAccess.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace GreenHouse.DataAccess
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<CoreDbContext>
    {
        public CoreDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<CoreDbContext>();
            optionsBuilder.UseSqlServer("Server=.\\MSSQL;Database=GreenHouse;Integrated Security=SSPI;TrustServerCertificate=True;MultipleActiveResultSets=true");

            return new CoreDbContext(optionsBuilder.Options);
        }
    }
}
