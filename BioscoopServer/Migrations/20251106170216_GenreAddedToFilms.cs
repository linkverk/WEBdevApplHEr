using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BioscoopServer.Migrations
{
    /// <inheritdoc />
    public partial class GenreAddedToFilms : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Genre",
                table: "Films",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Genre",
                table: "Films");
        }
    }
}
