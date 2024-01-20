using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenHouse.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AlterVw_TemperatureSensorImprovePerformance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"ALTER VIEW Vw_TemperatureSensor AS
SELECT * FROM
 (SELECT dbo.TemperatureSensor.ID,
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
            ON TemperatureSensorDetail.TemperatureSensorID = TemperatureSensor.ID

)RankedData
WHERE RankedData.row_num = 1;
GO");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
