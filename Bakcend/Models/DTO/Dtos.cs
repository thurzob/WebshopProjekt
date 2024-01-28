namespace Bakcend.Models.DTO
{
    public record CreateUserDto(string Name, string Password, string Email, int PhoneNumber, DateOnly Date, int MerchantId);
    public record UpdateUserDto(string Name, string Password, string Email, int PhoneNumber, DateOnly Date, int MerchantId);
    public record CreateQuantityDto(int QuantityPurchased);
    public record UpdateQuantityDto(int QuantityPurchased);
    public record CreateMerchantDto(string SerialName, string Type, int Price, int QuantityId);
    public record UpdateMerchantDto(string SerialName, string Type, int Price, int QuantityId);


}
