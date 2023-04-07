const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Landeptrai780',
    database: 'verema'
})

module.exports = connection;