/* To handle movie details.
 * GET - Show specific movie details,
 * POST - Update movie, Delete movie, and Add to cart.
 */
var query = require('./dbConnectivity/mysqlQuery');
var cart = null;
var total = 0.00;
var fineAmt = 0.00;

function handleCookieandPage(req, res, message, total) {
//	res.cookie('cartCookie', '1', {maxAge: null, httpOnly: false, signed: true, cart: cart});
	console.log("cart>>>"+ JSON.stringify(cart));
	res.render('admin_home', { title: 'A2Z', layout:false, locals: { admin_fname: req.session.admin_fname, message: message}});
}

exports.add = function(req, res) {
	console.log(req.param('m_id'));
	console.log(req.param('hidden_m_name'));
	console.log(req.param('hidden_rent_amount'));
	var params = req.session.mem_id;
	console.log("req.session.mem_id:"+params);
	console.log("admin_fname in cartpage:"+req.session.admin_fname);
	var eligibleNoOfMovies = 0, noOfMoviesToBeRtnd = 0;
	var movie = {m_id: req.param('m_id'), m_name: req.param('hidden_m_name'), m_banner: req.param('hidden_m_banner'), release_date: req.param('hidden_release_date'), category: req.param('hidden_cat'), rent_amount: req.param('hidden_rent_amount')};
	console.log(movie);
	if(cart === null) {
		noOfItemsInCart = 0;
		console.log("cart isNull now");
	} else {
		noOfItemsInCart = cart.length;
		console.log("cart lenght= "+cart.length);
	}
	if (params != null) {
//		to fetch number of movies to be returned by the specific user.
		var sqlStmt = "select users.type_of_user as type, count(*) as noOfMoviesToBeRtnd, users.balance from users join transactions trans on users.user_id = trans.user_id where trans.user_id = ? and trans.is_returned = false";
		query.execQuery(sqlStmt, params, function(err, rows) {
			try {
				console.log(rows);
				if(rows.length !== 0) {
					req.session.balance = rows[0].balance;
					req.session.mem_type = rows[0].type;
					if (rows[0].type === 'premium') eligibleNoOfMovies = parseInt(10) - parseInt(noOfMoviesToBeRtnd) - parseInt(noOfItemsInCart);
					else if (rows[0].type === 'simple') eligibleNoOfMovies = parseInt(2) - parseInt(noOfMoviesToBeRtnd) - parseInt(noOfItemsInCart);
					else {
						req.session.balance = 0;
						console.log("There may be some issue with member");
						res.render('admin_home', { titile: 'VLM', layout:false, locals: { admin_fname: req.session.admin_fname, error_message: 'There may be some issue with member. Please check the Member details.'}});
					}
					console.log("eligibleNoOfMovies:"+eligibleNoOfMovies);
					if (eligibleNoOfMovies > 0) {
						if(cart === null) {
							cart = [];
							total = movie.rent_amount;
							cart[0] = movie;
							console.log("cart:"+cart.toString());
							handleCookieandPage(req, res, "Movie added to bag!", total);
						} else {
							console.log("else cart:"+cart.toString());
							var alreadyAdded = false;
							for (var index = 0; index < cart.length; index++) {
								if ( movie.m_id === cart[index].m_id) {
									alreadyAdded = true;
									break;
								} else {
									console.log("movie rent amt:"+ movie.rent_amount);
									total = +total + +movie.rent_amount;
									console.log('total:'+total);
								}
							}
							if (alreadyAdded) {
								console.log("already in bag");
								handleCookieandPage(req, res, "Movie is already in bag!", total);
							} else {
								console.log("added to bag");
								cart[0].orderTotal = total;
								cart[cart.length] = movie;
								handleCookieandPage(req, res, "Movie added to bag!", total);
							}
						}
					}
				} else {
					req.session.balance = 0;
					console.log("There may be some issue with member");
					res.render('admin_home', { titile: 'VLM', layout:false, locals: { admin_fname: req.session.admin_fname, error_message: 'Something went wrong! Please try again.'}});
				}
			} catch (e) {
				console.log('Error>>'+e.message);
				res.status = 500;
				res.render('admin_home', { titile: 'VLM', layout:false, locals: { admin_fname: req.session.admin_fname, error_message: 'Sorry! Something went wrong'}});
			}
		});
	} else {
		res.render('admin_home', { titile: 'VLM', layout:false, locals: { admin_fname: req.session.admin_fname, error_message: 'Member ID missing to add to cart'}});
	}
};

exports.remove = function (req, res) {
	var item2Remove = req.param('m_id');
	console.log(item2Remove);
	for (var index = 0; index < cart.length; index++) {
		if ( item2Remove === cart[index].m_id) {
			total = +total - +cart[index].rent_amount;
			for (var x = index; x < cart.length; x++) {
				cart[x] = cart[x+1];
			}
			cart.pop();
		}
	}
	if (cart.length <= 0) {
		cart = null;
	}
	res.cookie('cartCookie', '1', {maxAge: null, httpOnly: false, signed: true, cart: cart});
	res.render('shopping-cart', { title: 'Shopping Bag', admin_fname: req.session.admin_fname, cart: cart, message: null, total: total, fine: fineAmt} );
};

exports.view = function (req, res) {
	console.log('req.session.mem_id:'+ req.session.mem_id);// req.session.mem_id
	console.log("before total");
	var mem_id = req.param.mem_id;
	var mem_type = req.session.mem_type;
	var fine = 0;
	console.log(mem_id);
	console.log(mem_type);
	if (mem_type === 'premium') {
		if (req.session.balance < 0) {
			total = fine;
			fineAmt = fine;
			console.log("in bal <0 prem");

			console.log(total);
			console.log(fine);


		}
	} else if (mem_type === 'simple') {
		console.log("in simple");
		total = parseInt(fine) + parseInt(total);
	}
	console.log(" aftertotal");
	res.render('shopping-cart', { title: 'Shopping Bag', admin_fname: req.session.admin_fname, cart: cart, message: null, total: total, fine: fineAmt} );
};


exports.confirmOrder = function (req, res) {
	var sqlStmt = "insert into transactions values (DEFAULT,?,?,?,?,?,?,?,1,0,?)";
	for (var index = 0; index < cart.length; index++) {
		console.log(index);
		var movie_id = cart[index].m_id;
		var params = [req.session.mem_id, cart[index].m_id, cart[index].m_name, cart[index].m_banner, cart[index].release_date,cart[index].rent_amount, cart[index].category, new Date()];
		query.execQuery(sqlStmt, params, function(err) {
			if (err) {
				res.render('admin_home', { title: 'VLM', admin_fname: req.session.admin_fname, cart: cart, error_message: 'Something went wrong. Please try again.'} );
			} else {
				sqlStmt = "update movies set available_copies = available_copies - 1 where movie_id = ?";
				query.execQuery(sqlStmt, movie_id, function(err) {
					if (err) {
						console.log("failed to complete the transaction. Undoing inconsistent changes.");
						sqlStmt = "delete from transactions where user_id=213456825 and movie_id = ? and is_returned=0";
						query.execQuery(sqlStmt, movie_id, function(err) {
							console.log("Resolved inconsiste transactions.");
						});
						res.render('admin_home', { title: 'VLM', admin_fname: req.session.admin_fname, cart: cart, error_message: 'Something went wrong. Please try again.'} );
					} else {
						if (!(req.session.mem_type === 'premium' && fineAmt === 0)) {
							sqlStmt = "update users set balance = 0 where user_id = ?";
							var member_id = [req.session.mem_id];
							query.execQuery(sqlStmt, member_id, function(err) {
								if (err) {
									console.log("Error in updating the user balance.");
								}
							});
						}
					}
				});
			}
		});
	}
	res.render('admin_home', { title: 'VLM', admin_fname: req.session.admin_fname, cart: cart, message: 'Rented Successfully!'} );
	cart = null;
	total = '0.00';
	fineAmt = '0.00';
	req.session.mem_id = null;
};

exports.clearCart = function (req, res) {
	res.clearCookie('cartCookie');
	req.session.mem_id = null;
	req.session.balance = null;
	req.session.mem_type = null;
	cart = null;
	total = '0.00';
	fineAmt = '0.00';
	res.render('admin_home', { title: 'VLM', admin_fname: req.session.admin_fname, cart: cart, message: 'Cart Cleared!'});
	
};
/*
 * 
var query = require('./dbConnectivity/mysqlQuery');
//connection.escape(userId) to avoid SQL Injection attacks
var sqlStmt = "select count(*) as isValidLogin, last_login_ts as lastLoginTS from login_detail where user_id=? and password=?";
var isLoggedIn = false;
var lastLoginTS = null;
var params = [req.param('email'), req.param('password')];
query.execQuery(sqlStmt, params, function(err, rows) {
console.log(rows);
if(rows.length !== 0) {
if (rows[0].isValidLogin === 1) {
lastLoginTS = rows[0].lastLoginTS;
req.session.username = req.param('email');
req.session.isLoggedin = true;
var backURL=req.header('Referer') || '/';
console.log(backURL);
if (backURL.indexOf('login', 0) === -1 && backURL.indexOf('register', 0) === -1) {
res.statusCode = 302;
res.redirect(backURL);
} else {
res.render('index', { titile: 'A2Z', layout:false, locals: { username: req.session.username, message: lastLoginTS}});
sqlStmt = 'update login_detail set last_login_ts = ? where user_id = ?';
params = [new Date(), req.param('email')];
query.execQuery(sqlStmt, params, function(err, rows) {
if (err) {
console.log('Error in logging the time stamp');
}
});
}
isLoggedIn = true;
} else {
res.render('login', { title: 'Login', layout:false, locals: { errorMessage: "Invalid Login. Try again."}});
}
}
});
 */
/*exports.registerCustomer = function (req, res) {
var query = require('./dbConnectivity/mysqlQuery');
//connection.escape(userId) to avoid SQL Injection attacks
var sqlStmt = "insert into login_detail values(?,?,?,?,null)";
var params = [req.param('fName'), req.param('lName'), req.param('email'), req.param('password')];
query.execQuery(sqlStmt, params, function(err, rows) {
if (!err) {
console.log("DATA : "+JSON.stringify(rows));
if(rows.length !== 0){
res.render('login', { title: 'Login', layout:false, locals: { errorMessage: ""}});
}
} else {
console.log("Error executing query");
res.status = 500;
res.render('register', {title: 'Register', layout:false, locals: { errorMessage: "Problem in registeration. Please try again with correct values!"}});
}
});
};
 */