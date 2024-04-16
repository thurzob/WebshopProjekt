namespace Bakcend.Models.DTO
{
    public class UpdatedPurchaseDto
    {
        public int Id { get; set; }
        public string BillingName { get; set; }
        public string BillingPostalCode { get; set; }
        public string BillingAddress { get; set; }
        public string Email { get; set; }
        public string PostalCode { get; set; }
        public string DeliveryAddress { get; set; }
        public string PhoneNumber { get; set; }
        
    }
}
