/**
 * New node file
 */
exports.insert=function (req,res){
	var query = require('./dbConnectivity/mysqlQuery');
	var mem_id = null;

	var sqlValidate = "select count(*) as isUserPresent from users where EMAIL = ?";
	var validateParams = [req.param('email')];
	query.execQuery(sqlValidate, validateParams, function(err, rows) {
		if (err) {
			console.log("ERROR: " + err.message);	
		}	
		if(rows[0].isUserPresent != 0){
			userPresent = true;
			res.render('admin_home',{
				admin_fname: req.session.admin_fname,
				message: "User already present",
				member_id: mem_id});

		} else {

			var sql = "insert into users(first_name,last_name, EMAIL,password, type_of_user, street,city,state,zipcode) values (?,?,?,?,?,?,?,?,?)";
			var params = [req.param('first_name'),req.param('last_name'),req.param('email'),req.param('password'),req.param('type_of_user'),req.param('street'),req.param('city'),req.param('state'),req.param('zipcode')];
			query.execQuery(sql, params, function(err, rows) {
				if (err) {
					console.log("ERROR: " + err.message);
				}
				var sql1 ="select user_id from users order by user_id desc limit 1";
				query.execQuery(sql1,function(err,rows){
					if(rows!==0){
						console.log(rows[0].user_id);
						mem_id=rows[0].user_id;

					}

					//var lmemid=sql1+1;
					//console.log(results);
					res.render('admin_home',{
						admin_fname: req.session.admin_fname,
						message: "User Successfully Created",
						member_id: mem_id});	
				});
			});

		}
	});

};


