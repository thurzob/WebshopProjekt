using System;
using System.Collections.Generic;

namespace Bakcend.Models;

public partial class Merchant
{
    public int Id { get; set; }

    public string SerialName { get; set; } = null!;

    public string Type { get; set; } = null!;

    public int Price { get; set; }

    public int ProductId { get; set; }

    public int Quantity { get; set; }

    public string? UserId { get; set; }

    public virtual Aspnetuser? User { get; set; }
}
