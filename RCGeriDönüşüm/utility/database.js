const mysql=require('mysql2');
//database bilgileri
const connection=mysql.createConnection(
    {
        host:"localhost",
        user:"root",
        database:"recyclecoin",
        password:"mysql123"
    }
);
//dışarı açtık
module.exports=connection.promise();