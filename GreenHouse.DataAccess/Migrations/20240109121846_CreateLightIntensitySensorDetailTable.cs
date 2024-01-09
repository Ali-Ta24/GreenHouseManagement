using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenHouse.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class CreateLightIntensitySensorDetailTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LightIntensitySensorDetail",
                columns: table => new
                {
                    ID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LightIntensitySensorID = table.Column<int>(type: "int", nullable: false),
                    LightIntensitySensorValue = table.Column<float>(type: "real", nullable: false),
                    LastModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastModificationTime = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LightIntensitySensorDetail", x => x.ID);
                    table.ForeignKey(
                        name: "FK_LightIntensitySensorDetail_LightIntensitySensor_LightIntensitySensorID",
                        column: x => x.LightIntensitySensorID,
                        principalTable: "LightIntensitySensor",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LightIntensitySensorDetail_LightIntensitySensorID",
                table: "LightIntensitySensorDetail",
                column: "LightIntensitySensorID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LightIntensitySensorDetail");
        }
    }
}
