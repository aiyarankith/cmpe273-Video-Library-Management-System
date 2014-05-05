
/*
 * To handle movie details.
 * GET - Show specific movie details,
 * POST - Update movie, Delete movie, and Add to cart.
 */

exports.show = function(req, res) {
	var query = require('./dbConnectivity/mysqlQuery');
	console.log("mem id in show movie"+req.session.mem_id);
	var sqlStmt = "select movie_id as m_id, movie_name as m_name, movie_banner as banner, release_date, rent_amount, category, available_copies as quantity from movies where movie_id=? and is_Published = true";
	console.log(req.param('m_id'));
	var params = [req.param('m_id')];
	query.execQuery(sqlStmt, params, function(err, rows) {
		if(rows.length !== 0) {
			try {
				var movie = [];
				if (rows[0].quantity <= 0) {
					mQty = 'Sold Out';
					console.log('>> Following movie is out of stock: '+ rows[0].m_id);
				}
				movie[0] = {
						m_id : rows[0].m_id,
						m_name : rows[0].m_name,
						banner : rows[0].banner,
						release_date : rows[0].release_date,
						rent_amount : rows[0].rent_amount,
						category : rows[0].category,
						quantity : rows[0].quantity
				};
				console.log(movie[0].m_name);
				res.render('movie-details', { title: rows[0].m_name, layout:false,	locals: { username : req.session.username, movie : movie, errorMessage: "", admin_fname: req.session.admin_fname}});
			} catch (e) {
				console.log('Error>>'+e.message);
				res.status = 500;
				res.render('admin_home', { titile: 'VLM', layout:false, locals: { admin_fname: req.session.admin_fname, error_message: 'Sorry! Something went wrong'}});
			}
		} else {
			res.status = 500;
			res.render('admin_home', { titile: 'VLM', layout:false, locals: { admin_fname: req.session.admin_fname, error_message: 'Sorry! Something went wrong'}});
		}
	});
};
exports.update = function (req, res) {
	var query = require('./dbConnectivity/mysqlQuery');
	var sqlStmt = "update movies set movie_name = ?," +
	" movie_banner = ?," +
	" release_date = ?," +
	" rent_amount = ?," +
	" category = ?," +
	" available_copies = ?" +
	" where movie_id = ?";
	console.log("movie id to be updated->"+req.param('m_id'));
	var params = [req.param('m_name'), req.param('banner'), req.param('release_date'), req.param('rent_amount'), req.param('category'), req.param('quantity'), req.param('m_id')];
	query.execQuery(sqlStmt, params, function(err, rows) {
		try {
			console.log(rows.length );
			if(rows.length !== 0) {
				res.redirect(req.get('referer'));
			} else {
				res.status = 500;
				res.render('admin_home', { titile: 'VLM', layout:false, locals: { admin_fname: req.session.admin_fname, error_message: 'Sorry! Something went wrong'}});
			}
		} catch (e) {
			console.log('Error>>'+e.message);
			res.status = 500;
			res.render('admin_home', { titile: 'VLM', layout:false, locals: { admin_fname: req.session.admin_fname, error_message: 'Sorry! Something went wrong'}});
		}
	});
};

exports.unPublish = function (req, res) {
	var query = require('./dbConnectivity/mysqlQuery');
	var sqlStmt = "update movies set" +
	" is_published = ?" +
	" where movie_id = ?";
	console.log("movie id to be deleted->"+req.param('m_id'));
	var params = [false, req.param('m_id')];
	query.execQuery(sqlStmt, params, function(err, rows) {
		try {
			if(err) {
				res.redirect(req.get('referer'));
			} else {
				res.render('admin_home', { titile: 'VLM', layout:false, locals: { admin_fname: req.session.admin_fname, message: 'Movie deleted!'}});
			}
		} catch (e) {
			console.log('Error>>'+e.message);
			res.status = 500;
			res.render('admin_home', { titile: 'VLM', layout:false, locals: { admin_fname: req.session.admin_fname, error_message: 'Sorry! Something went wrong'}});
		}
	});
};

exports.showMovieList = function (req, res) {
	var sqlquery = require('./dbConnectivity/mysqlQuery');
	if(req.session.mem_id == null || req.param('member_id') !== req.session.mem_id)
	{
		req.session.mem_id = req.param('member_id');
		console.log("*******************"+req.session.mem_id);
	}
//	connection.escape(userId) to avoid SQL Injection attacks
	var searchCriteria = req.param('search');
	var category = req.param('category');
	var movieIndex = req.param('movieIndex');
	var nextlast = req.param('nextlast');
	var sqlStmt = '';
	if(movieIndex===''){
		if(nextlast==='next')
		{
			sqlStmt = "select * from MOVIES where is_published = 1 limit "+movieIndex+",10";
			movieIndex = parseInt(movieIndex) + 10;
		}
		else
		{
			if(movieIndex<20)
			{movieIndex=0;}
			else
			{movieIndex = parseInt(movieIndex) - 20;}
			sqlStmt = "select * from MOVIES where is_published = 1 limit "+movieIndex+",10";
			movieIndex = parseInt(movieIndex) + 10;
		}
	}
	else{
		if(nextlast==='next')
		{
			sqlStmt = "select * from MOVIES where is_published = 1 and "+category+" like '%"+ searchCriteria +"%' limit "+movieIndex+",10";
			movieIndex = parseInt(movieIndex) + 10;
		}
		else
		{
			if(movieIndex<20)
			{movieIndex=0;}
			else
			{movieIndex = parseInt(movieIndex) - 20;}
			sqlStmt = "select * from MOVIES where is_published = 1 and "+category+" like '%"+ searchCriteria +"%' limit "+movieIndex+",10";
			movieIndex = parseInt(movieIndex) + 10;
		}	
	}
	var params = [];
	sqlquery.execQuery(sqlStmt, params, function(err, rows) {
		console.log(rows.length);
		if(rows.length !== 0) {
			res.render('movielist.ejs',
					{movieResults:rows,movieIndex:movieIndex,category:category,search:searchCriteria,admin_fname: req.session.admin_fname},
					function(err, result) {
						if (!err) {res.end(result);}
						else {res.end('An error occurred');console.log(err);}
					});
		}
		else
		{
			console.log('no data found');
			res.render('movielist.ejs',
					{movieResults:[],movieIndex:movieIndex,category:category,search:searchCriteria,admin_fname: req.session.admin_fname},
					function(err, result) {
						if (!err) {res.end(result);}
						else {res.end('An error occurred');console.log(err);}
					});
		}
	});
};


