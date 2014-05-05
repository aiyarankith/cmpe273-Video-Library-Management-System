/**
 * New node file to Retrive Member Details and Update the details.
 */

function fetch_details(callback, id){
	var connection      = require('./dbConnectivity/mysqlQuery');
	
	var sql = "SELECT * FROM USERS WHERE USER_ID = ?";
	var param = [id];
	connection.execQuery(sql, param, function(err, rows, fields) {
	    	if(rows.length!==0){
				console.log("DATA : "+JSON.stringify(rows));
				callback(err, rows);
			}
	    	else{
	    		callback(err, 0);
	    	}
	    });
	
}

function fetch_history(callback, id){
	var connection      = require('./dbConnectivity/mysqlQuery');
	
	var sql = "SELECT * FROM TRANSACTIONS WHERE USER_ID = ?";
	var param = [id];
	connection.execQuery(sql, param, function(err, rows, fields) {
	    	if(rows.length!==0){
				console.log("DATA : "+JSON.stringify(rows));
				callback(err, rows);
			}
	    	else{
	    		callback(err, 0);
	    	}
	    });
	
}

function update_customer(user_id, f_name, l_name, email, street, city, state, zipcode){
	var connection      = require('./dbConnectivity/mysqlQuery');
	
	var sql = "UPDATE USERS SET FIRST_NAME=?, LAST_NAME=?, EMAIL=?, STREET=?, CITY=?, STATE=?, ZIPCODE=? WHERE USER_ID=?";
	var param = [f_name,l_name,email,street,city,state,zipcode,user_id];
	connection.execQuery(sql, param, function(err, rows) {
		if (err) {
			console.log('Error in Updating Records');
		}
	});
	
	
}

exports.deleteuser=function(req,res){
	var query =require('./dbConnectivity/mysqlQuery');
    var param=req.param('uid');
    var sql="update users set is_active=0 where user_id=?";
    query.execQuery(sql,param,function(err,rows){
    	if(err){
    		console.log("Error in deleting user");
    	}
    	else{
    		res.render('admin_home',{deletemsg: "User has been deleted with Membership id", admin_fname:req.session.admin_fname});
      	    }
    });
};

exports.fetch_details = fetch_details;
exports.fetch_history = fetch_history;
exports.update_customer = update_customer;