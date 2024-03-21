namespace Bakcend.Models.DTO
{
    public record CreateUserDto(string Name, string Email, int PhoneNumber);
    public record UpdateUserDto(string Name, string Email, int PhoneNumber);
    public record CreatePurchaseDto(string BillingName, string BillingPostalCode, string BillingAddress, string Email, string PostalCode, string DeliveryAddress, string PhoneNumber, string UserId, DateTime Date);
    public record CreateMerchantDto(string UserId, string SerialName, string Type, int Price,  int ProductId, int Quantity);
    public record UpdateMerchantDto(string SerialName, string Type, int Price, string UserId);
    public record CreateProductDto(string SerialName, string Type, int Price);
    public record UpdateProductDto(string SerialName, string Type, int Price);
    public record PasswordResetRequestDto(string Email, string UpdatesPassword );
}
