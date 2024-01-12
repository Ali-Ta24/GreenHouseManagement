using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenHouse.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class Vw_TemperatureSensorAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"CREATE VIEW Vw_TemperatureSensor
                                   AS
                                   SELECT dbo.TemperatureSensor.ID,
                                          dbo.TemperatureSensor.CreatedBy,
                                          dbo.TemperatureSensor.LastModifiedBy,
                                          dbo.TemperatureSensor.CreationTime,
                                          dbo.TemperatureSensor.LastModificationTime,
                                          dbo.TemperatureSensor.TemperatureSensorName,
                                          dbo.UserGreenhouseHall.HallName
                                   FROM dbo.TemperatureSensor
                                       INNER JOIN dbo.UserGreenhouseHall
                                           ON dbo.TemperatureSensor.GreenhouseHallID = dbo.UserGreenhouseHall.ID;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DROP VIEW Vw_TemperatureSensor");
        }
    }
}
