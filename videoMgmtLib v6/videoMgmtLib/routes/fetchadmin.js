/**
 * New node file
 */
exports.fetchdata=function(req,res){
	var query = require('./dbConnectivity/mysqlQuery');
	console.log("log1");
	var sql1 = "select * from users where user_id=? and password=? and type_of_user=?";
	var params = [req.param('uid'), req.param('password'),'admin'];
	query.execQuery(sql1, params, function(err, rows,fields) {
		console.log("Rows :: "+JSON.stringify(rows));
		if (rows.length!==0) {
			req.session.admin_fname = rows[0].first_name;
			console.log("Row objects:: "+JSON.stringify(rows));
			res.render('admin_home',{
				admin_fname: req.session.admin_fname
			});
		} else {
//			callback(err,"error");
			console.log("error" +err);
			res.render('adminlogin', { title: 'homepage', error_message: "Invalid Login. Try again."});

		}
	});
};
exports.logout=function(req,res){
	req.session = null;
	res.render('index');
};