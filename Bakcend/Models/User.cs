using System;
using System.Collections.Generic;
using System.Numerics;
using System.Reflection.Metadata;

namespace Bakcend.Models;

public partial class User
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string Email { get; set; } = null!;

    public int PhoneNumber { get; set; }

    public DateOnly? Date { get; set; }

    public int MerchantId { get; set; }

    public virtual Merchant Merchant { get; set; } = null!;
}
