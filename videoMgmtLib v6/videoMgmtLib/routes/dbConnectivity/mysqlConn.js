/**
 * New node file
 * To create mysql connection pool.
 */
var mysql = require('mysql');
var pool  = mysql.createPool({
	host     : 'localhost',
	user     : 'root',
	password : '13111990',
	port     : '3306',
	database : 'vlibdb',
	connectionLimit : '10'
});

exports.pool = pool;
