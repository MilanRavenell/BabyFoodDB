var express = require('express');
var app = express();
var sql = require("mssql");
const port = process.env.PORT;

app.use(express.json());

//config for your database
var config = {
    user: 'babyfoodadmin@babyfood',
    password: 'babyfoodpass69!',
    server: 'babyfood.database.windows.net',
    connectionTimeout: 30000,
    database: 'BabyFoodDB',
    port: 1433,
    options: { encrypt: true } 
};

app.get('/', function (req, res) {
    // connect to your database
    var ac = req.param('acronym');

    new sql.ConnectionPool(config).connect().then(pool => {
 		return pool.request().query("SELECT * FROM acronyms")
  		}).then(result => {
    		let rows = result.recordset
    		res.setHeader('Access-Control-Allow-Origin', '*')
  			res.status(200).json(rows);
    		sql.close();
  		}).catch(err => {
    		res.status(500).send(err)
    		sql.close();
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
