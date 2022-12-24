using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace ASPveEF.Models
{
    public class ItemDataContext:DbContext
    {
        public DbSet<Items>item{ get; set; }
    }
}