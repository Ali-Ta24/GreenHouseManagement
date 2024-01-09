using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenHouse.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class UpdateApplicationUserTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropColumn(
            //    name: "NationalCodeId",
            //    table: "ApplicationUser");

            //migrationBuilder.AlterColumn<string>(
            //    name: "UserName",
            //    table: "ApplicationUser",
            //    type: "nvarchar(25)",
            //    maxLength: 25,
            //    nullable: false,
            //    defaultValue: "",
            //    oldClrType: typeof(string),
            //    oldType: "nvarchar(max)",
            //    oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.AlterColumn<string>(
            //    name: "UserName",
            //    table: "ApplicationUser",
            //    type: "nvarchar(max)",
            //    nullable: true,
            //    oldClrType: typeof(string),
            //    oldType: "nvarchar(25)",
            //    oldMaxLength: 25);

            //migrationBuilder.AddColumn<string>(
            //    name: "NationalCodeId",
            //    table: "ApplicationUser",
            //    type: "nvarchar(10)",
            //    maxLength: 10,
            //    nullable: false,
            //    defaultValue: "");
        }
    }
}
