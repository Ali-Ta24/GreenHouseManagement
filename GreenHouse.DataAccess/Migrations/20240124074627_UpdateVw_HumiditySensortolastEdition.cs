using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenHouse.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class UpdateVw_HumiditySensortolastEdition : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"SET QUOTED_IDENTIFIER ON;
                                   SET ANSI_NULLS ON;
                                   GO
                                   ALTER VIEW Vw_HumiditySensor
                                   AS
                                   SELECT *
                                   FROM
                                   (
                                       SELECT dbo.HumiditySensor.ID,
                                              dbo.HumiditySensor.CreatedBy,
                                              dbo.HumiditySensor.LastModifiedBy,
                                              dbo.HumiditySensor.CreationTime,
                                              dbo.HumiditySensor.LastModificationTime,
                                              dbo.HumiditySensor.HumiditySensorName,
                                              dbo.UserGreenhouseHall.HallName,
                                              dbo.UserGreenhouseHall.ID AS GreenhouseHallID,
                                              dbo.AspNetUsers.UserName,
                                              dbo.AspNetUsers.FirstName + N' ' + dbo.AspNetUsers.LastName AS FullName,
                                              dbo.HumiditySensorDetail.HumiditySensorValue,
                                              dbo.HumiditySensorDetail.LastModificationTime AS LastState,
                                              ROW_NUMBER() OVER (PARTITION BY dbo.HumiditySensor.ID
                                                                 ORDER BY dbo.HumiditySensorDetail.LastModificationTime DESC
                                                                ) AS row_num
                                       FROM dbo.HumiditySensor
                                           INNER JOIN dbo.UserGreenhouseHall
                                               ON dbo.HumiditySensor.GreenhouseHallID = dbo.UserGreenhouseHall.ID
                                           LEFT JOIN dbo.AspNetUsers
                                               ON AspNetUsers.Id = UserGreenhouseHall.UserID
                                           LEFT JOIN dbo.HumiditySensorDetail
                                               ON HumiditySensorDetail.HumiditySensorID = HumiditySensor.ID
                                   ) RankedData
                                   WHERE RankedData.row_num = 1;
                                   GO
                                   
                                   ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
