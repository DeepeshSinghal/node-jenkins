var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user:"root",
    password:"",
    database:"parksfoc_wrd1"

});

con.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
  });
module.exports = con;
