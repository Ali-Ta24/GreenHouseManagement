using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenHouse.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class Vw_HumiditySensorAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"CREATE VIEW Vw_HumiditySensor
                                   AS
                                   SELECT dbo.HumiditySensor.ID,
                                          dbo.HumiditySensor.CreatedBy,
                                          dbo.HumiditySensor.LastModifiedBy,
                                          dbo.HumiditySensor.CreationTime,
                                          dbo.HumiditySensor.LastModificationTime,
                                          dbo.HumiditySensor.HumiditySensorName,
                                          dbo.UserGreenhouseHall.HallName,
                                          dbo.UserGreenhouseHall.ID AS GreenhouseHallID,
                                   	   dbo.AspNetUsers.UserName
                                   FROM dbo.HumiditySensor
                                       INNER JOIN dbo.UserGreenhouseHall
                                           ON dbo.HumiditySensor.GreenhouseHallID = dbo.UserGreenhouseHall.ID
                                   	LEFT JOIN dbo.AspNetUsers 
                                   		ON AspNetUsers.Id = UserGreenhouseHall.UserID;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DROP VIEW Vw_HumiditySensor");

        }
    }
}
