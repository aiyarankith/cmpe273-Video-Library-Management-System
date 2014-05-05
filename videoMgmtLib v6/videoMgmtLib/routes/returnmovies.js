/**
 * To return a movie
 */


exports.returnmovie=function(req,res){
	var query=require('./dbConnectivity/mysqlQuery');
	var param=[req.param('uid2'),req.param('tid2'),req.param('mid2')];
	var uid=req.param('uid2');
	console.log(req.param('uid2'));
	var sql="update transactions set is_returned=1 where user_id=? and transaction_id=? and movie_id=?";
	query.execQuery(sql,param,function(err,rows){
		if(err){
			console.log('cannot modify records');
		}
	});
	console.log(req.param('uid2'));
	console.log(req.param('mid2'));
	console.log(req.param('tid2'));
	var sql="select AVAILABLE_COPIES from movies where MOVIE_ID=?";
	query.execQuery(sql,req.param('mid2'),function(err,rows){
		if(rows.length!=0){

			var old=rows[0].AVAILABLE_COPIES;

			var newavailable=parseInt(old) + 1;

			var sql1='update movies set AVAILABLE_COPIES=? where MOVIE_ID=?';
			query.execQuery(sql1,[newavailable,req.param('mid2')],function(err,rows){
				if(err){
					console.log("cannot modify records");
				}
				else{
					res.redirect('member_details?id='+uid);

				}
			});
		}
	});

};