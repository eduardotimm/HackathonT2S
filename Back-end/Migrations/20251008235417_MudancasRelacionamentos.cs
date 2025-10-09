using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HackathonT2S.Migrations
{
    public partial class MudancasRelacionamentos : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Ratings_ProjectID",
                table: "Ratings",
                column: "ProjectID");

            migrationBuilder.AddForeignKey(
                name: "FK_Ratings_Projects_ProjectID",
                table: "Ratings",
                column: "ProjectID",
                principalTable: "Projects",
                principalColumn: "ProjectID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ratings_Projects_ProjectID",
                table: "Ratings");

            migrationBuilder.DropIndex(
                name: "IX_Ratings_ProjectID",
                table: "Ratings");
        }
    }
}
