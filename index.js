var express = require('express');
var app = express();
var sql = require("mssql");
const port = process.env.PORT;

app.use(express.json());

// config for your database
var config = {
    user: 'sa',
    password: 'mypassword',
    server: 'localhost', 
    database: 'SchoolDB' 
};

app.get('/', function (req, res) {
    // connect to your database
    var ac = req.param('acronym');
    res.send(user);
    // sql.connect(config, function (err) {
    
    //     if (err) console.log(err);

    //     // create Request object
    //     var request = new sql.Request();
           
    //     // query to the database and get the records
    //     request.query('select * from Student', function (err, recordset) {
            
    //         if (err) console.log(err)

    //         // send records as a response
    //         res.send(recordset);
            
    //     });
    // });
});

app.listen(port, () => console.log('Server is running..'));
