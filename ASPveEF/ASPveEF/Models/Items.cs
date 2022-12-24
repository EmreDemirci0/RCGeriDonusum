using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ASPveEF.Models
{
    public class Items
    {
        public int id { get; set; }
        public string name{ get; set; }
        public string itemImg { get; set; }
        public string recyclingType { get; set; }
        public int carbonQuantity { get; set; }
    }
}