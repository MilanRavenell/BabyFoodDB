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

app.post('/retrieve', function (req, res) {
    // connect to your database
    var ac = req.body.acronym;

    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request().query(`SELECT * FROM Acronyms WHERE Acronym='${ac}' ORDER BY id DESC;`)
    }).then(result => {
        let rows = result.recordset
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.send(rows);
        res.status(200).json(rows);
        console.log(rows);
        sql.close();
    }).catch(err => {
        res.status(500).send(err)
        sql.close();
    });
});

app.post('/add', function (req, res) {
    // connect to your database
    var ac = req.body.acronym;
    var desc = req.body.description;

    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request().query(`INSERT INTO Acronyms (Acronym, Description) VALUES ('${ac}', '${desc}');`)
    }).then(result => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.status(200).send('Success');
        sql.close();
    }).catch(err => {
        res.status(500).send(err)
        sql.close();
    });
});

app.post('/update', function (req, res) {
    // connect to your database
    var ac = req.body.acronym;
    var desc = req.body.description;
    var index = req.body.index;

    // ensure acronym is in the database first

    var id;

    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request().query(`SELECT *, ROW_NUMBER() OVER (ORDER BY id ASC) AS rownum FROM Acronyms WHERE Acronym='${ac}';`)
    }).then(async function(result) {

        var j = await getIndex(result, index);
        id = await result.recordset[j]['id'];

        sql.close();
    }).catch(err => {
        res.status(500).send(err);
        sql.close();
    });

    new sql.ConnectionPool(config).connect().then(pool2 => {
        return pool2.request().query(`UPDATE Acronyms SET Acronym='${ac}', Description='${desc}' WHERE id = ${id};`)
    }).then(result2 => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.status(200).send('Success');
        sql.close();
    }).catch(err2 => {
        res.status(500).send(err2)
        sql.close();
    });
});

async function getIndex(r, index) {
    for (var i = 0; i < r.recordset.length; i++) {
        if (r.recordset[i]['rownum'] == index) {
            return i;
        }
    }
}

app.listen(port, () => console.log('Server is running....'));
