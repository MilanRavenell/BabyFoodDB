var express = require('express');
var app = express();
var sql = require("mssql");
const port = process.env.PORT;

app.use(express.json());

const pool = new sql.ConnectionPool({
    user: 'babyfoodadmin',
    password: 'babyfoodpass69!',
    server: 'tcp:babyfood.database.windows.net',
    connectionTimeout: '30000',
    database: 'BabyFoodDB' 
});

var conn = pool;

// config for your database
// var config = {
//     user: 'babyfoodadmin',
//     password: 'babyfoodpass69!',
//     server: 'tcp:babyfood.database.windows.net',
//     connectionTimeout: '30000',
//     database: 'BabyFoodDB' 
// };

app.get('/', function (req, res) {
    // connect to your database
    var ac = req.param('acronym');

    conn.connect().then(function () {
	    var req = new sql.Request(conn);
	    req.query("SELECT * FROM acronym").then(function (recordset) {
	        res.send(recordset);
	        conn.close();
	    })
	    .catch(function (err) {
	        console.log(err);
	        conn.close();
	    });
	})
    .catch(function (err) {
        console.log(err);
    });

    // sql.connect(config, function (err) {
    
         //if (err) console.log(err);

         // create Request object
         //var request = new sql.Request();

    //     query to the database and get the records
    //     request.query('select * from acronym', function (err, recordset) {
            
            // if (err) console.log(err)

             // send records as a response
            // res.send(recordset);
            
        // });
    // });
});

app.listen(port, () => console.log('Server is running..'));
