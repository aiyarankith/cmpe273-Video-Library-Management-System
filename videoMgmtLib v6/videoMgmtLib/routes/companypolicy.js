/*
 * cron job to apply penalty if user has not returned movie dvd
 * convert premium customer to simple customer 
 * */
exports.calculateFine = function(){
	console.log('calculate fine');
	var sqlquery = require('./dbConnectivity/mysqlQuery');
	var sqlStmt = "select user_id,movie_issued from transactions where is_returned=0";
	var params = [];
	sqlquery.execQuery(sqlStmt, params, function(err, rows) {
		if(rows.length !== 0) {
			for(var iterate=0; iterate < rows.length; iterate++ )
			{
				var movieIssuedDay = rows[iterate].movie_issued;
				var day = movieIssuedDay.getDate();
				movieIssuedDay.setDate(day+30);
				var today = new Date();
				if(today > movieIssuedDay)
				{
					console.log('user will be fined');
					var updateStmt = "update users SET balance = 0.5 WHERE user_id = ?";
					var params = [rows[iterate].user_id];
					sqlquery.execQuery(updateStmt, params, function(err, rows) {
						if(rows.length !== 0) {
							console.log('data updated successfully');
						}
						else
						{	console.log('data not updated successfully');	}
					});
				}
				else
				{	console.log('user not fined');	}
			}
		}
		else
		{	console.log('no data found');	}
	});

	var selectInActiveUsers = "select user_id,type_of_user,registration_time from users";
	var params = [];
	sqlquery.execQuery(selectInActiveUsers, params, function(err, rows) {
		if(rows.length !== 0) {
			for(var iterate=0; iterate < rows.length; iterate++ )
			{
				var movieIssuedDay = rows[iterate].registration_time;
				var day = movieIssuedDay.getDate();
				movieIssuedDay.setDate(day+30);
				var today = new Date();
				if(today > movieIssuedDay)
				{
					if(rows[iterate].type_of_user!=='simple')
					{
						console.log('simple user status will be updated');
						var currentDate = new Date();
						var updateStmt = "update users SET type_of_user = 'simple', registration_time=NOW() WHERE user_id = ?";
						var params = [rows[iterate].user_id];
						sqlquery.execQuery(updateStmt, params, function(err, rows) {
							if(rows.length !== 0) {
								console.log('data updated successfully');
							}
							else
							{	console.log('data not updated successfully');	}
						});
					}
				}
				else
				{
					console.log('user status will not be updated');
				}
			}
		}
	});
};
