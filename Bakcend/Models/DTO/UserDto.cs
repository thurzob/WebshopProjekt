namespace Bakcend.Models.DTO
{
    public class UserDto
    {
        public string Id { get; set; }
        public string FullName { get; set; }
        public int Age { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string PhoneNumber { get; set; }
        public string OrderStatus { get; set; }

        public List<MerchantDto> Merchants { get; set; }




       


        
        public string PurchaseBillingName { get; set; }
        public string PurchaseBillingPostalCode { get; set; }
        public string PurchaseBillingAddress { get; set; }
        public string PurchaseEmail { get; set; }
        public string PurchasePostalCode { get; set; }
        public string PurchasaeDeliveryAddress { get; set; }
        public string PurchasePhoneNumber { get; set; }

        public DateTime PurchaseDate { get; set; }
        
    }

    public class MerchantDto
    {
        public string Type { get; set; }
        public string SerialName { get; set; }
        public int Price { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        // Itt töltsd ki a többi merchant adatot
    }

}
