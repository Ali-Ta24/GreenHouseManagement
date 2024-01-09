using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenHouse.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class CreateTemperatureSensorDetailTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TemperatureSensorDetail",
                columns: table => new
                {
                    ID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TemperatureSensorID = table.Column<int>(type: "int", nullable: false),
                    TemperatureValue = table.Column<float>(type: "real", nullable: false),
                    LastModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastModificationTime = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TemperatureSensorDetail", x => x.ID);
                    table.ForeignKey(
                        name: "FK_TemperatureSensorDetail_TemperatureSensor_TemperatureSensorID",
                        column: x => x.TemperatureSensorID,
                        principalTable: "TemperatureSensor",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TemperatureSensorDetail_TemperatureSensorID",
                table: "TemperatureSensorDetail",
                column: "TemperatureSensorID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TemperatureSensorDetail");
        }
    }
}
