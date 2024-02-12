using System;
using System.Collections.Generic;

namespace Bakcend.Models;

public partial class Product
{
    public int Id { get; set; }

    public string SerialName { get; set; } = null!;

    public string Type { get; set; } = null!;

    public int Price { get; set; }
}
