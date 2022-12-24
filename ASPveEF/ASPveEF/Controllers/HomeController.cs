using ASPveEF.Models;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Xml.Linq;

namespace ASPveEF.Controllers
{
    public class HomeController : Controller
    {
        MySqlConnection conn = new MySqlConnection("server=localhost;Database=recyclecoin;Uid=root;Pwd='mysql123'");
        MySqlCommand cmd;

        public ActionResult Index()
        {
            #region EF işlemleri
           
            string sql = "SELECT * from tblrecycleıtems ";
            List<int> ids = new List<int>();
            List<string> names = new List<string>();
            List<string> itemImgs = new List<string>();
            List<string> recyclingTypes = new List<string>();
            List<int> carbonQuantitys = new List<int>();


            conn.Open();
            MySqlCommand command = new MySqlCommand(sql, conn);
            MySqlDataReader reader = command.ExecuteReader();
            ItemDataContext db = new ItemDataContext();
            while (reader.Read())
            {
                int id = reader.GetInt32(0); // 0. sütun (id)
                string name = reader.GetString(1); // 1. sütun (name)
                string itemImg = reader.GetString(2); // 2. sütun (city)
                string recyclingType = reader.GetString(3); // 3. sütun (recy.type)
                int carbonQuantity = reader.GetInt32(4); // 4. sütun (carbonquantity)
                ViewBag.a = id;
                ids.Add(id);
                names.Add(name);
                itemImgs.Add(itemImg);
                recyclingTypes.Add(recyclingType);
                carbonQuantitys.Add(carbonQuantity);

            }



            for (int i = 0; i < ids.Count; i++)
            {
                Items I = new Items();
                I.id = ids[i];
                I.name = names[i];
                I.itemImg = itemImgs[i];
                I.recyclingType = recyclingTypes[i];
                I.carbonQuantity = carbonQuantitys[i];
                db.item.Add(I);
            }

            foreach (var item in db.item.ToList())//her çalıştıpğında veriler üst üste binmesin
            {
                ids.Clear();
                names.Clear();
                itemImgs.Clear();
                recyclingTypes.Clear();
                carbonQuantitys.Clear();
                db.item.Remove(item);
            }

            db.SaveChanges();
            #endregion
            List<Items> items = db.item.ToList();//EF kullanılıyor.
            for (int i = 0; i < items.Count; i++)
            {    
                if(i==0)
                    ViewBag.ItemNames +=  items[i].name;
                else
                    ViewBag.ItemNames += "," + items[i].name;
            }

            return View();
        }

        public ActionResult About()//weather
        {
            
            //string api = "25701f38150a4ea5235aed9a62d845f1";
            //string city = "istanbul";

            //string connection = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&mode=xml&lang=tr&units=metric&appid=" + api;
            //XDocument document = XDocument.Load(connection);
            //ViewBag.V4 = document.Descendants("temperature").ElementAt(0).Attribute("value").Value;
           


            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}