using Bakcend.Models.DTO;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Bakcend.Models.DTO
{
    public record CreateUserDto(string FullName, string UserName, string Email, int Age, string PhoneNumber, string PasswordHash, string Id, string OrderStatus); 
    public record CreateOrderStatusDto(string Id, string OrderStatus);
    public record UpdateUserDto(string FullName, string UserName, string Email, int Age, string PhoneNumber, string PasswordHash);
    public record UpdateStatusDto(string OrderStatus);
    public record CreatePurchaseDto(string BillingName, string BillingPostalCode, string BillingAddress, string Email, string PostalCode, string DeliveryAddress, string PhoneNumber, int Tidid, string UserId, DateTime Date );
    public record UpdatePurchaseDto(string BillingName, string BillingPostalCode, string BillingAddress, string Email, string PostalCode, string DeliveryAddress, string PhoneNumber, int Id);
    public record CreateMerchantDto(string UserId, string SerialName, string Type, int Price,  int ProductId, int Quantity);
    public record UpdateMerchantDto(string SerialName, string Type, int Price, int Quantity, string UserId);
    public record CreateProductDto(string SerialName, string Type, int Price);
    public record UpdateProductDto(string SerialName, string Type, int Price);
    
    public record PasswordResetRequestDto(string Email, string UpdatesPassword );


}


