const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'db4free.net',
    user: 'verema2023',
    password: 'verema2023',
    database: 'verema2023'
})

module.exports = connection;