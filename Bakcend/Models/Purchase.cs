using System;
using System.Collections.Generic;

namespace Bakcend.Models;

public partial class Purchase
{
    public int Id { get; set; }

    public string BillingName { get; set; } = null!;

    public string BillingPostalCode { get; set; } = null!;

    public string BillingAddress { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PostalCode { get; set; } = null!;

    public string DeliveryAddress { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public string UserId { get; set; } = null!;

    public DateTime Date { get; set; }

    public virtual Aspnetuser? User { get; set; }
}
