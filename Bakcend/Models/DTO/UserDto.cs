namespace Bakcend.Models.DTO
{
    public class UserDto
    {
        public string Id { get; set; }
        public string FullName { get; set; }
        public int Age { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }

        
       
        public string MerchantType { get; set;}
        public string MerchantSerialName { get; set; }
        public int MerchantPrice { get; set; }
        public int MerchantProductId { get; set; }
        public int MerchantQuantity { get; set; }


        
        public string PurchaseBillingName { get; set; }
        public string PurchaseBillingPostalCode { get; set; }
        public string PurchaseBillingAddress { get; set; }
        public string PurchaseEmail { get; set; }
        public string PurchasePostalCode { get; set; }
        public string PurchasaeDeliveryAddress { get; set; }
        public string PurchasePhoneNumber { get; set; }

        public DateTime PurchaseDate { get; set; }
        
    }
}
