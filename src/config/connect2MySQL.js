const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12610702',
    password: '7GCTCeipkR',
    database: 'sql12610702'
})

module.exports = connection;