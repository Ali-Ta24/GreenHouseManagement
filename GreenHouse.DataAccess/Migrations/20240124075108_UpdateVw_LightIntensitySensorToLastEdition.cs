using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenHouse.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class UpdateVw_LightIntensitySensorToLastEdition : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"SET QUOTED_IDENTIFIER ON;
                                   SET ANSI_NULLS ON;
                                   GO
                                   ALTER VIEW Vw_LightIntensitySensor
                                   AS
                                   SELECT *
                                   FROM
                                   (
                                       SELECT dbo.LightIntensitySensor.ID,
                                              dbo.LightIntensitySensor.CreatedBy,
                                              dbo.LightIntensitySensor.LastModifiedBy,
                                              dbo.LightIntensitySensor.CreationTime,
                                              dbo.LightIntensitySensor.LastModificationTime,
                                              dbo.LightIntensitySensor.LightIntensitySensorName,
                                              dbo.UserGreenhouseHall.HallName,
                                              dbo.UserGreenhouseHall.ID AS GreenhouseHallID,
                                              dbo.AspNetUsers.UserName,
                                              dbo.AspNetUsers.FirstName + N' ' + dbo.AspNetUsers.LastName AS FullName,
                                              dbo.LightIntensitySensorDetail.LightIntensitySensorValue,
                                              dbo.LightIntensitySensorDetail.LastModificationTime AS LastState,
                                              ROW_NUMBER() OVER (PARTITION BY dbo.LightIntensitySensor.ID
                                                                 ORDER BY dbo.LightIntensitySensorDetail.LastModificationTime DESC
                                                                ) AS row_num
                                       FROM dbo.LightIntensitySensor
                                           INNER JOIN dbo.UserGreenhouseHall
                                               ON dbo.LightIntensitySensor.GreenhouseHallID = dbo.UserGreenhouseHall.ID
                                           LEFT JOIN dbo.AspNetUsers
                                               ON AspNetUsers.Id = UserGreenhouseHall.UserID
                                           LEFT JOIN dbo.LightIntensitySensorDetail
                                               ON LightIntensitySensorDetail.LightIntensitySensorID = LightIntensitySensor.ID
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
