const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Landeptrai780',
    database: 'VeReMa'
})

module.exports = connection;