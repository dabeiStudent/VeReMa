const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'us-cdbr-east-06.cleardb.net',
    user: 'b1c91bddb53336',
    password: 'aef67c7a',
    database: 'heroku_65cdd6700dd2f06'
})

module.exports = connection;