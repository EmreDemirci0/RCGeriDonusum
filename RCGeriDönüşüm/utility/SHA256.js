const crypto=require("crypto");

//Dışarı açacağımız SHA256 Algoritması
const SHA256Algorithm=function(userMail){
    const fileBuffer=userMail;
    const hash=crypto.createHash("sha256")
    const finalHex=hash.update(fileBuffer).digest('hex')
    return (finalHex)
};
//Dışarı Açıyoruz
module.exports=SHA256Algorithm;