const shift = require('./Model/shift');
const express = require('express');
const http = require('http');
var cors = require('cors')
const mysql = require('mysql');
const hostname = '127.0.0.1';
const port = 3000;


// Create Connection DB
const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '0810',
  database : 'shift'
});

db.connect((err) => {
    if(err){
        throw err
    }
    console.log('MySql Connaction....')
});

const app = express();

app.use(express.json())
app.use(cors())


//A function get as an input an ID card and returns the shifts
app.post('/getAllShifts', (req , res) => {
    const id = req.body.id;
    console.log(id + "---------------");
    let sql = 'SELECT * FROM shift WHERE ID = ?';
    db.query(sql , Number(id),(err , result) => {
        if(err) throw err;
        res.send(result);   
        console.log(result);
    })
    
}) 

app.post('/shift', (req, res) => {
    console.log("ok");
    const sh = new shift(req.body);
    console.log(sh);
    lastShiftStatus(sh.ID,(result) => {
            console.log("ok");
            const shift = [sh.ID ,result,new Date(sh.updateTime)];
            console.log(shift);

            let sql = 'INSERT INTO Shift (ID, Status, updateTime) VALUES (?,?,?)';
            db.query(sql, shift, function (err, result) {
                if (err) throw err;
                console.log("Number of records inserted: " + result.affectedRows);
            });
            res.json("shift addedd");
     });
  });
  
  app.post('/lastShift', (req , res) => {
    console.log("ok");
    lastShiftStatus(req.body.id,(result) => {
            res.json(result);
     });
    
}) 

app.listen(port ,hostname , () => {
    console.log('Server started on port 3000')
});

 lastShiftStatus = (id, callback) => {
    let sql = `SELECT Status FROM shift WHERE ID = ${id} ORDER BY updateTime DESC LIMIT 1`;
    db.query(sql, (err , result) => {
        if(err) throw err; 
        if(result[0])
        return callback(!result[0].Status);
        else return callback(true);
    });
    
}