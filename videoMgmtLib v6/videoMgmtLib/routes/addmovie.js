/**
 * New node file
 */
/**
 * New node file
 */
exports.insertmovie=function (req,res){
	var MOVIE_NAME=req.param('moviename');
	var MOVIE_BANNER=req.param('moviebanner');
	var RELEASE_DATE=req.param('releasedate');
	var RENT_AMOUNT=req.param('rentamount');
	var AVAILABLE_COPIES= req.param('availablecopies');
	var CATEGORY=req.param('category');

	var connPool = require('./dbConnectivity/mysqlConn').pool;
	connPool.getConnection(function (err, connection) {	
		var sql = "insert into movies (MOVIE_NAME,MOVIE_BANNER,RELEASE_DATE,RENT_AMOUNT,AVAILABLE_COPIES,CATEGORY) values (?,?,?,?,?,?)";
		connection.query(sql, [MOVIE_NAME,MOVIE_BANNER,RELEASE_DATE,RENT_AMOUNT,AVAILABLE_COPIES,CATEGORY], function (err,rows,fields){
			if (err) {
				console.log("ERROR: " + err.message);
			}
			//console.log(results);
			res.render('admin_home',{
				admin_fname: req.session.admin_fname,
				movie_added_message: "New Movie Successfully Added"});
		});
	});
};