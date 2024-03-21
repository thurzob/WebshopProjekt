using System;
using System.Collections.Generic;

namespace Bakcend.Models;

public partial class Passwordresetrequest
{
    public string Email { get; set; } = null!;

    public string UpdatesPassword { get; set; } = null!;
}
