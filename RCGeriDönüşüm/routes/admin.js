const express=require("express")
const router=express.Router();

const connection = require("../utility/database");

var isItLogin=true;
var items=[];
var warningText,successColor;
var BoxTinPrice,BottlePrice,GlassPrice,NewspaperPrice;
var currentMail;

//Loginin post olayında gerektiği duruma göre responsu render ederek adminlogin.pug isimli dosyayı çağırır 
router.get("/login",(req,res,next)=>{ 
    if(!isItLogin){
        res.render("adminlogin",{title:"Admin Login Page",wrong:"Incorrect Admin email or Password"});
        isItLogin=true;  
    }
        else{
            res.render("adminlogin",{title:"Admin Login Page"}); //  res.sendFile(path.join(__dirname,"../views/index.html"));  
    }
   
})
// burda veritabanında çektiğimiz verilerle kullanıcının girdiği verileri mukayese eder.
//eğer doğruysa adminHomePage e atar eğer yanlış ise adminlogin sayfasına tekrar atar. 
router.post("/login",(req,res,next)=>{
 
    connection.execute("Select * from tbladmin").      catch((err)=>{console.log("error:"+err);})
      .then((result) => {  
        for(var i =0;i<result[0].length;i++){//********************************** */
            
            if(req.body.emails==result[0][i].email && req.body.passwords==result[0][i].password){
                //giriş başarılı
                res.redirect("/admin/adminHomePage",);
                currentMail=req.body.emails;
                isItLogin=true;
                break;
            }
            else{
            //giriş başarısız
                isItLogin=false;
            }
        }
       if(isItLogin==false){
        res.redirect("/admin/login");

       }
       items=[];
    });
// burada veritabanı bağlantısı açıp ürünleri veritabanından items dizisine çekiyoruz.
    connection.execute("Select * from tblrecycleıtems")
    .then((result) => {      //Ürün girişi
            for(var i =0;i<result[0].length;i++){
            items.push({name:result[0][i].name,
                itemImg:result[0][i].itemImg,
                recyclingtype:result[0][i].recyclingtype,
                CarbonQuantity:result[0][i].CarbonQuantity
            })           
          }  
        }).catch((err)=>{console.log("error:"+err);});  

        BoxTinPrice=0,GlassPrice=0,NewspaperPrice=0,BottlePrice=0;
})
//get metodu çalışınca adminhomepage.pug isimli dosya çağırılır.
router.get("/adminHomePage",(req,res,next)=>{
   //eğer login yapmadan adminhomepage e giderse login sayfasına atar. 
    if(currentMail==null){
        res.redirect("/admin/login")
        return;
    }
    priceCheck(BoxTinPrice,0)
    priceCheck(GlassPrice,1)
    priceCheck(NewspaperPrice,2)
    priceCheck(BottlePrice,3)

    res.render("adminHomePage",{title:"Admin Page",items:items,successColor:successColor,success:warningText});
    warningText="";
})
router.post("/adminHomePage",(req,res,next)=>{
   //butona basınca adminhomepagepostupdate metoduyla textboxa girilen değer karşılıaştırılır değer geçerliyse veritabanındaki değer güncellenir.
    //güncelleme tamamlandıktan sonra tekrar aynı sayfa açılır.
   if(Object.hasOwnProperty.bind(req.body)('changeButton')){
    adminHomePagePostUpdate(req.body.BoxTin,1)
    adminHomePagePostUpdate(req.body.Glass,2)
    adminHomePagePostUpdate(req.body.Newspaper,3)
    adminHomePagePostUpdate(req.body.Bottle,4)
     
    BoxTinPrice=req.body.BoxTin;
    GlassPrice=req.body.Glass;
    NewspaperPrice=req.body.Newspaper;
    BottlePrice=req.body.Bottle;
    
    res.redirect("/admin/adminHomePage")
    }
    //logout butonununa basınca adminlogin sayfasına gönderir
    else if(Object.hasOwnProperty.bind(req.body)('signOutButton')){
        res.redirect("/admin/login")

    }
    
})
//adminin girdiği değerlere göre mesaj döndürür ve veritabanına kayıt eder.
function adminHomePagePostUpdate(reqbody,i){
    if(reqbody==""){
        warningText="Please enter the new values ​​of the items you want to update.Content is empty"
        successColor="text-danger";
    }
    if(reqbody!=""&& reqbody>0 ){
  
    connection.execute("update tblRecycleıtems set CarbonQuantity=? where id=?",[reqbody,i]);
    }
    else{
        warningText="Invalid character or you have already entered the same value.Please check"
        successColor="text-danger";

    }
    
}
//Adminin girdiği değeri kontrol eder.
function priceCheck(itemPrice,i){
    if(itemPrice!=0 && itemPrice>0){
        if(itemPrice==items[i].CarbonQuantity){
            warningText="Invalid character or you have already entered the same value.Please check"
            successColor="text-danger";

        }
    else{
        items[i].CarbonQuantity=itemPrice;
        warningText="Correctly entered values ​​have been successfully updated.";
        successColor="text-success";

    }
    }
    
}


module.exports=router;
