using System;
using System.Collections.Generic;

namespace Bakcend.Models;

public partial class Quantity
{
    public int Id { get; set; }

    public int QuantityPurchased { get; set; }

    public virtual ICollection<Merchant> Merchant { get; set; } = new List<Merchant>();
}
