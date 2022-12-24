const express=require("express")
const app=express();
const bodyParser=require("body-parser")

//pug dosyasını çalıştırmaya yarar.
app.set("view engine","pug");
app.set("views","./views");


//const admin=require("./routes/admin")
const userRoutes=require("./routes/user")
const adminRoutes=require("./routes/admin")

//Bazı chunkları objeye çevirmek için
app.use(bodyParser.urlencoded({extended:false}))
//public isimli klasördeki içerikleri public(dışarı açmak) için
app.use(express.static(require("path").join(__dirname,"public")))


//userın göreceği kısımları programa ekledik
app.use("/user",userRoutes)
//adminin göreceği kısımları programa ekledik
app.use("/admin",adminRoutes)


 


//burada üst kısımdakiler çalışmazsa mantıken elimizde olmayan sayfa isteği olacak.
// ondan dolayı 404 hatası döndürmek gerekir.render() ile beraer 404-error.pug isimli dosyayı tarayıcıya veririz.
app.use((req,res)=>{
    res.status(404).render("404-error",{title:"404 Found"}); 
})
app.listen(3000,()=>{
    console.log("3000 portu")
})