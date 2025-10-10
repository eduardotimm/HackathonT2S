using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HackathonT2S.Migrations
{
    public partial class AddLocalPathToProject : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LocalPath",
                table: "Projects",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LocalPath",
                table: "Projects");
        }
    }
}
