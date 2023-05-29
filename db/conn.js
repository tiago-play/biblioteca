const mysql = require('mysql')

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'bal9890121',
    database: 'nodemysql1'
})

module.exports = pool