namespace Bakcend.Models.DTO
{
    public record CreateUserDto(string Name, string Password, string Email, int PhoneNumber, DateOnly Date);
    public record UpdateUserDto(string Name, string Password, string Email, int PhoneNumber, DateOnly Date);
    public record CreateQuantityDto(int QuantityPurchased);
    public record UpdateQuantityDto(int QuantityPurchased);
    public record CreateMerchantDto(string SerialName, string Type, int Price, int UserId);
    public record UpdateMerchantDto(string SerialName, string Type, int Price, int UserId);

    public record CreateProductDto(string SerialName, string Type, int Price);
    public record UpdateProductDto(string SerialName, string Type, int Price);
}
