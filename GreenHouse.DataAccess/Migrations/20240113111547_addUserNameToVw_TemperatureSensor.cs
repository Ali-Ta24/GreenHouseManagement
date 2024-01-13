using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenHouse.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class addUserNameToVw_TemperatureSensor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"ALTER VIEW Vw_TemperatureSensor
                                   AS
                                   SELECT dbo.TemperatureSensor.ID,
                                          dbo.TemperatureSensor.CreatedBy,
                                          dbo.TemperatureSensor.LastModifiedBy,
                                          dbo.TemperatureSensor.CreationTime,
                                          dbo.TemperatureSensor.LastModificationTime,
                                          dbo.TemperatureSensor.TemperatureSensorName,
                                          dbo.UserGreenhouseHall.HallName,
                                          dbo.UserGreenhouseHall.ID AS GreenhouseHallID,
                                   	   dbo.AspNetUsers.UserName
                                   FROM dbo.TemperatureSensor
                                       INNER JOIN dbo.UserGreenhouseHall
                                           ON dbo.TemperatureSensor.GreenhouseHallID = dbo.UserGreenhouseHall.ID
                                   	LEFT JOIN dbo.AspNetUsers 
                                   		ON AspNetUsers.Id = UserGreenhouseHall.UserID;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
