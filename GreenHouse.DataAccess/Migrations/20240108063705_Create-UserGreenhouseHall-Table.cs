using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenHouse.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class CreateUserGreenhouseHallTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.CreateTable(
                //name: "ApplicationUser",
                //columns: table => new
                //{
                //    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                //    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                //    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                //    NationalCodeId = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                //    IsActive = table.Column<bool>(type: "bit", nullable: false),
                //    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                //    UserName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                //    NormalizedUserName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                //    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                //    NormalizedEmail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                //    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                //    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                //    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                //    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                //    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                //    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                //    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                //    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                //    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                //    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                //},
                //constraints: table =>
                //{
                //    table.PrimaryKey("PK_ApplicationUser", x => x.Id);
                //});

            migrationBuilder.CreateTable(
                name: "UserGreenhouseHall",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModificationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserID = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    HallName = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserGreenhouseHall", x => x.ID);
                    table.ForeignKey(
                        name: "FK_UserGreenhouseHall_AspNetUsers_UserID",
                        column: x => x.UserID,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserGreenhouseHall_UserID",
                table: "UserGreenhouseHall",
                column: "UserID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserGreenhouseHall");

            //migrationBuilder.DropTable(
            //    name: "ApplicationUser");
        }
    }
}
