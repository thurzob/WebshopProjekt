using System;
using System.Collections.Generic;

namespace Bakcend.Models;

public partial class Quantity
{
    public int Id { get; set; }

    public int QuantityPurchased { get; set; }

    public int MerchantId { get; set; }

    public virtual Merchant Merchant { get; set; } = null!;
}
