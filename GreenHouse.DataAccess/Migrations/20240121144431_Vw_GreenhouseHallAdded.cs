using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenHouse.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class Vw_GreenhouseHallAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"CREATE VIEW Vw_GreenhouseHall
                                   AS
                                   SELECT dbo.UserGreenhouseHall.ID,
                                          dbo.UserGreenhouseHall.CreatedBy,
                                          dbo.UserGreenhouseHall.LastModifiedBy,
                                          dbo.UserGreenhouseHall.CreationTime,
                                          dbo.UserGreenhouseHall.LastModificationTime,
                                          dbo.UserGreenhouseHall.HallName,
                                          dbo.UserGreenhouseHall.UserID,
                                          dbo.AspNetUsers.FirstName + N' ' + dbo.AspNetUsers.LastName AS FullName
                                   FROM dbo.UserGreenhouseHall
                                       INNER JOIN dbo.AspNetUsers
                                           ON dbo.UserGreenhouseHall.UserID = dbo.AspNetUsers.Id;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DROP VIEW Vw_GreenhouseHall");
        }
    }
}
