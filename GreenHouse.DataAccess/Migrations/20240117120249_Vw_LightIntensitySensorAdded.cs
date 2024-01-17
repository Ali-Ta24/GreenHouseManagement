using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenHouse.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class Vw_LightIntensitySensorAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"CREATE VIEW Vw_LightIntensitySensor
                                   AS
                                   SELECT dbo.LightIntensitySensor.ID,
                                          dbo.LightIntensitySensor.CreatedBy,
                                          dbo.LightIntensitySensor.LastModifiedBy,
                                          dbo.LightIntensitySensor.CreationTime,
                                          dbo.LightIntensitySensor.LastModificationTime,
                                          dbo.LightIntensitySensor.LightIntensitySensorName,
                                          dbo.UserGreenhouseHall.HallName,
                                          dbo.UserGreenhouseHall.ID AS GreenhouseHallID,
                                   	   dbo.AspNetUsers.UserName
                                   FROM dbo.LightIntensitySensor
                                       INNER JOIN dbo.UserGreenhouseHall
                                           ON dbo.LightIntensitySensor.GreenhouseHallID = dbo.UserGreenhouseHall.ID
                                   	LEFT JOIN dbo.AspNetUsers 
                                   		ON AspNetUsers.Id = UserGreenhouseHall.UserID;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DROP VIEW Vw_LightIntensitySensor");

        }
    }
}
