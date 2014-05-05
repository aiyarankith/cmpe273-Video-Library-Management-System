//Change Client Password 

exports.changepassword=function(req,res){
	console.log("Session at Change Pwd: : ", req.session.user_fname);
	res.render('changepassword',{
		user_fname:req.session.user_fname, 
		user_member_id:req.session.member_id,
	});

};

exports.changepassworddb=function(req,res){
	var query = require('./dbConnectivity/mysqlQuery');
	console.log("hello",req.session.member_id);
	var sql='select password from users where user_id=?';
	var param=req.session.member_id;
	query.execQuery(sql,param,function(err,rows,fields){
		if(rows.length != 0){
			var oldpwd=req.body.oldpwd.toString();
			var pwd=rows[0].password;
			var newpwd=req.param('newpwd');
			var cpw=req.param('cpw'); 
			if(newpwd!==cpw){
				res.render('changepassword',{nomatch:"Your Password and Confirm Password fields do not Match"});
			}
			if(pwd===oldpwd){
				var sqlStmt='update users set password=? where user_id=?';
				var params=[req.param('newpwd'),req.session.member_id];
				query.execQuery(sqlStmt,params,function(err,rows){
					if (err) {
						console.log('Error in Updating Records');
					}
					else{
						res.render('profile',{
							user_fname:req.session.user_fname, 
							user_member_id:req.session.member_id,
							member_details: req.session.user_details,
							movie_details: req.session.movie_details,
							message:"Your Password has been Changed Successfully"});
					}
				});
			}
			else{

				res.render('changepassword',{nomatch:"Your Old Password is not Correct", user_fname:req.session.user_fname, 
					user_member_id:req.session.member_id,
					member_details: req.session.user_details,
					movie_details: req.session.movie_details});
			}
		}
	});
};