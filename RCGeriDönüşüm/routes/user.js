
const express = require("express");
const router = express.Router();
const sha256=require("../utility/SHA256")
//const admin=require("./admin");
//database.js isimli dosyadan veritabanı bilgilerini aldık.
const connection = require("../utility/database");
var isItLogin=true
var items=[]
var userCarbonAmount,userRCamount;
var currentSHA256Adress;
var warningText;
var successColor;
var currentMail;


// tarayıcıdan /user/login istenince ekrana login sayfası gelir ve eğer şifre yanlış ise wrong isimli değişken içersindeki ekrana yazar
// ondan sonra bunu render() ile  birlikte .pug dosyalarımızla birleştirip dinamik bir web sayfası oluştuturuz.
router.get("/login",(req, res, next) => {
   
    if(!isItLogin){
        res.render("userlogin", { title: "Login Page ",wrong:"Incorrect User email or Password",wrongColor:"text-danger"}); //  res.sendFile(path.join(__dirname,"../views/index.html"));
        isItLogin=true;  
    }
        else{
        res.render("userlogin", { title: "Login Page ",renk:"text-success"});   
    }
   
});
// kullanıcının tblUser veritabanında olup olmadığını kontrol ediyoruz.
router.post("/login",(req, res, next) => { 
      connection.execute("Select * from tblUser").      catch((err)=>{console.log("error:"+err);})
      .then((result) => {  
        for(var i =0;i<result.length;i++){
            if(req.body.email==result[0][i].email&&req.body.password==result[0][i].password){
                 currentSHA256Adress=sha256(req.body.email);
                //Giriş Başarılı
                currentMail=req.body.email;
                res.redirect("/user/HomePage",);
                isItLogin=true;
                userCarbonAmount=result[0][i].userCarbonQuantity;
                userRCamount=result[0][i].userRCamount;
                break;
            }
            else{//Giriş Başarısız
                isItLogin=false;
                //console.log("veritabanında yok")
            }
        }
        if(!isItLogin){ //Giriş başarız ise aynı sayfaya tekrar atadık. 
             res.redirect("/user/login");
        }
       items=[];

    });
//Burda veritabanından ürünleri çekiyoruz
    connection.execute("Select * from tblrecycleıtems")
    .then((result) => {      
            for(var i =0;i<result[0].length;i++){
            items.push({name:result[0][i].name,
                itemImg:result[0][i].itemImg,
                recyclingtype:result[0][i].recyclingtype,
                CarbonQuantity:result[0][i].CarbonQuantity
            })           
          }  
        }).catch((err)=>{console.log("error:"+err);}); 
});

router.get("/HomePage",(req, res, next) => { 
//eğer login yapmadan homepage giderse login sayfasına atar. 
    if(currentMail==null){
        res.redirect("/user/login")
        return;
       }
        
        userCarbonAmount=Number(Number(userCarbonAmount).toFixed(3)); 
        userRCamount=Number(Number(userRCamount).toFixed(3));

        res.render("HomePage", { title: "Home Page",items:items,userCarbonAmount:userCarbonAmount,userRCamount:userRCamount,successColor:successColor,Success:warningText}); 
        warningText="";
        

    });
//
router.post("/HomePage",(req, res, next) => {
    //burada kullanıcının elindeki karbonların girdiği kadarını coine çeviriyor
    if(Object.hasOwnProperty.bind(req.body)('exchangeButton')){
        if(req.body.exchange!="" && req.body.exchange>0){
            warningText="Carbon Conversion Successful";
            successColor="text-success";
            if(userCarbonAmount<req.body.exchange){
                warningText="Carbon Conversion Unsuccessful";   
                successColor="text-danger"
            }
           else{
            //veritabanı işlemleri
            connection.execute("update tblUser set userRCamount=?,UserCarbonQuantity=? where SHA256Adress=?",[userRCamount+(req.body.exchange/100),userCarbonAmount-req.body.exchange,currentSHA256Adress]);
            userRCamount=userRCamount+(req.body.exchange/100);
            userCarbonAmount=userCarbonAmount-req.body.exchange;
            }
        }
        else{
             warningText="Carbon Conversion Unsuccessful";
             successColor="text-danger";
        }
        
    }
    //burada  kullanıcının istediği bir kişinin sha adresini girerek kendi coinlerinin bir kısmını gönderebilir.
    else if(Object.hasOwnProperty.bind(req.body)('transferButton')){
       
        
        connection.execute("Select * from tblUser").      catch((err)=>{console.log("error:"+err);})
        .then((result) => {  
        for(var i =0;i<result.length;i++){
            if(req.body.transferSha256==result[0][i].SHA256Adress){//Veritabanında olup olmadığının kntrolü
                if(req.body.transferSha256==currentSHA256Adress){
                    warningText="An error occurred in the transfer part. Please check.";
                    successColor="text-danger"
                    return;
                }

                console.log("Veritabaninda SHA256 Adresi Bulunmaktadir.")
                
                if(req.body.transferAmount>userRCamount || req.body.transferAmount<=0){
                    console.log("elimizdekinden fazla ya da eksili değer girildi.")
                    warningText=("More or less value entered or blank than we have.Please check transfer amount")
                    successColor="text-danger"
                    return;    
                }
                if(!isNaN(req.body.transferAmount)){
                    warningText=("Transfer Successfull")
                    successColor="text-success"
                
                result[0][i].userRCamount+=Number(req.body.transferAmount);
                connection.execute("update tblUser set userRCamount=? where SHA256Adress=?",[result[0][i].userRCamount,req.body.transferSha256]);

                userRCamount-=req.body.transferAmount;
                connection.execute("update tblUser set userRCamount=? where SHA256Adress=?",[userRCamount,currentSHA256Adress]);
                }   
                else{
                warningText=(/*"An error occurred in the transfer part.Please check."*/"Please enter valid characters")
                successColor="text-danger"
                }
            }
            else{
                warningText="you entered the wrong SHA-256 address"
                successColor="text-danger"
            }
            
            

            
        }
        // if(!boolyin){
        //     warningText="yanlıs3333"
        //     boolyin=false;
        // }
    })  
    }   
    // burada kullanıcının girdiği atık değerleri*veritabanındaki aktif carbon değeri kadar carbon kullanıcıya eklenir.
    else if(Object.hasOwnProperty.bind(req.body)('recycleButton')){
        
    
    warningText="Waste Conversion Unsuccessful";
    successColor="text-danger";

    updateCarbonCount(req.body.BoxTin,0);//buradaki i'ler değişcek
    updateCarbonCount(req.body.Glass,1);
    updateCarbonCount(req.body.Newspaper,2);
    updateCarbonCount(req.body.Bottle,3);
    if((( req.body.Bottle<=0 || req.body.Bottle>100) &&
    ( req.body.BoxTin<=0 || req.body.BoxTin>100) &&
    ( req.body.Glass<=0 || req.body.Glass>100) &&
    ( req.body.Newspaper<=0 || req.body.Newspaper>100))){
    warningText="Waste Conversion Unsuccessful";
    successColor="text-danger";
    }

    }
    //burada butona basınca çıkış yapar ve login sayfasına gönderir
    else if(Object.hasOwnProperty.bind(req.body)('signOutButton')){  
            res.redirect("/user/login")
    }
    if(!Object.hasOwnProperty.bind(req.body)('signOutButton'))
     res.redirect("/user/HomePage")
});
//veritabanında kullancının carbonlarını günceller.
function updateCarbonCount(reqbody,i){
    if(reqbody!=""&& reqbody>0 && reqbody<=100){

        connection.execute("Select * from tblrecycleıtems")
        .then((result) => {
           

                connection.execute("update tblUser set UserCarbonQuantity=? where SHA256Adress=?",[userCarbonAmount+reqbody*items[i].CarbonQuantity,currentSHA256Adress]);
                userCarbonAmount=userCarbonAmount+reqbody*items[i].CarbonQuantity;
                warningText="The products you entered less than 100 were successfully converted";      
                successColor="text-success"
      
        }).catch((err)=>{console.log("error:"+err);}); 

       
    }  
}
//Üstteki kısımları diğer dosyalar ulaşabilmesi için açtık.
module.exports = router;
