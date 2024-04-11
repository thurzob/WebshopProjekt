using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bakcend.Migrations
{
    /// <inheritdoc />
    public partial class AddOrderStatusToAspNetUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_merchant_aspnetusers_UserId",
                table: "merchant");

            migrationBuilder.DropForeignKey(
                name: "purchase_ibfk_1",
                table: "purchase");

            migrationBuilder.AddColumn<string>(
                name: "AspnetuserId",
                table: "purchase",
                type: "varchar(255)",
                nullable: true,
                collation: "utf8mb4_general_ci")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "OrderStatus",
                table: "aspnetusers",
                type: "varchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "",
                collation: "utf8mb4_general_ci")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "passwordresetrequest",
                columns: table => new
                {
                    Email = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false, collation: "utf8mb4_general_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UpdatesPassword = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false, collation: "utf8mb4_general_ci")
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_general_ci");

            migrationBuilder.CreateIndex(
                name: "IX_purchase_AspnetuserId",
                table: "purchase",
                column: "AspnetuserId");

            migrationBuilder.AddForeignKey(
                name: "merchant_ibfk_1",
                table: "merchant",
                column: "UserId",
                principalTable: "aspnetusers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_purchase_aspnetusers_AspnetuserId",
                table: "purchase",
                column: "AspnetuserId",
                principalTable: "aspnetusers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "merchant_ibfk_1",
                table: "merchant");

            migrationBuilder.DropForeignKey(
                name: "FK_purchase_aspnetusers_AspnetuserId",
                table: "purchase");

            migrationBuilder.DropTable(
                name: "passwordresetrequest");

            migrationBuilder.DropIndex(
                name: "IX_purchase_AspnetuserId",
                table: "purchase");

            migrationBuilder.DropColumn(
                name: "AspnetuserId",
                table: "purchase");

            migrationBuilder.DropColumn(
                name: "OrderStatus",
                table: "aspnetusers");

            migrationBuilder.AddForeignKey(
                name: "FK_merchant_aspnetusers_UserId",
                table: "merchant",
                column: "UserId",
                principalTable: "aspnetusers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "purchase_ibfk_1",
                table: "purchase",
                column: "UserId",
                principalTable: "aspnetusers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
