var express = require('express');
var app = express();
var sql = require("mssql");
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.post('/', function (req, res) {
    // connect to your database
    var ac = req.body.acronym;

    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request().query(`SELECT * FROM acronyms WHERE acronym='${ac}';`)
        }).then(result => {
            let rows = result.recordset
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.status(200).json(rows);
                console.log(rows);
            sql.close();
        }).catch(err => {
            res.status(500).send(err)
            sql.close();
    });
});

app.listen(port, () => console.log('Server is running..'));
