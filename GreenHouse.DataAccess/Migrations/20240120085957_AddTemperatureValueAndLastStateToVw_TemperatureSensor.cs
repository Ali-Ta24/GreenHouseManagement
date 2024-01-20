using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenHouse.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddTemperatureValueAndLastStateToVw_TemperatureSensor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"ALTER VIEW Vw_TemperatureSensor AS
WITH RankedData
AS (SELECT dbo.TemperatureSensor.ID,
           dbo.TemperatureSensor.CreatedBy,
           dbo.TemperatureSensor.LastModifiedBy,
           dbo.TemperatureSensor.CreationTime,
           dbo.TemperatureSensor.LastModificationTime,
           dbo.TemperatureSensor.TemperatureSensorName,
           dbo.UserGreenhouseHall.HallName,
           dbo.UserGreenhouseHall.ID AS GreenhouseHallID,
           dbo.AspNetUsers.UserName,
           dbo.TemperatureSensorDetail.TemperatureValue,
           dbo.TemperatureSensorDetail.LastModificationTime AS LastState,
           ROW_NUMBER() OVER (PARTITION BY dbo.TemperatureSensor.ID
                              ORDER BY dbo.TemperatureSensorDetail.LastModificationTime DESC
                             ) AS row_num
    FROM dbo.TemperatureSensor
        INNER JOIN dbo.UserGreenhouseHall
            ON dbo.TemperatureSensor.GreenhouseHallID = dbo.UserGreenhouseHall.ID
        LEFT JOIN dbo.AspNetUsers
            ON AspNetUsers.Id = UserGreenhouseHall.UserID
        LEFT JOIN dbo.TemperatureSensorDetail
            ON TemperatureSensorDetail.TemperatureSensorID = TemperatureSensor.ID)
SELECT ID,
       CreatedBy,
       LastModifiedBy,
       CreationTime,
       LastModificationTime,
       TemperatureSensorName,
       HallName,
       GreenhouseHallID,
       UserName,
       TemperatureValue,
       LastState
FROM RankedData
WHERE row_num = 1;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
