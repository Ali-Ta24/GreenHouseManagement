using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenHouse.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class CreateHumiditySensorDetailTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HumiditySensorDetail",
                columns: table => new
                {
                    ID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HumiditySensorID = table.Column<int>(type: "int", nullable: false),
                    HumiditySensorValue = table.Column<float>(type: "real", nullable: false),
                    LastModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastModificationTime = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HumiditySensorDetail", x => x.ID);
                    table.ForeignKey(
                        name: "FK_HumiditySensorDetail_HumiditySensor_HumiditySensorID",
                        column: x => x.HumiditySensorID,
                        principalTable: "HumiditySensor",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HumiditySensorDetail_HumiditySensorID",
                table: "HumiditySensorDetail",
                column: "HumiditySensorID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HumiditySensorDetail");
        }
    }
}
