
/**
 * Module dependencies.
 */

var application_root = __dirname
, express = require('express')
, routes = require('./routes')
, user = require('./routes/user')
, http = require('http')
, path = require('path')
, loginMgmt = require('./routes/loginMgmt')
, fetchadmin=require('./routes/fetchadmin')
, adduser=require('./routes/adduser')
, profile=require('./routes/profile')
, movie = require('./routes/movieHandler')
, cart = require('./routes/cartHandler')
, searchuser=require('./routes/searchuser')
, returnmovies= require ('./routes/returnmovies')
, addmovie = require('./routes/addmovie')
, cronjob = require('./routes/companypolicy')
, app = express(); // To create an express server.
var mysql_member_details = require("./routes/mysql_member_details");

//all environments
app.set('port', process.env.PORT || 4400);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.configure(function () {
//	app.use(express.bodyParser());
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());
//	app.use(express.cookieParser());																						//Parses the Cookie header field and populates req.cookies 
	app.use(express.cookieParser("thissecretrocks"));
	app.use(express.cookieSession({ secret: 'xDDFsdfddsdfSDdbg', cookie: { maxAge: null }}));									//To maintain cookie-based sessions and populates req.session
	app.use(app.router);
	app.use(express.static(path.join(application_root, "public")));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

//To log server creation.
function requestLog () {
	console.log('TimeStamp:'+ new Date() + ' Express server created. Listening @ port:' + app.get('port'));
}
http.createServer(app, requestLog()).listen(app.get('port'));


/*cron job logic*/
/*var CronJob = require('cron').CronJob;
new CronJob('00 13 06 * * *', function(){
	console.log("---------------------------------enter  cron");
	cronjob.calculateFine();
}, null, true, "America/Los_Angeles");*/

/*
 * List of routes
 */
//Index page
app.get('/', routes.index);
app.get('/home',loginMgmt.homepage);
app.post('/showMovieList/:movieIndex',movie.showMovieList);
/*app.get('/nextPage/:movieIndex',movie.nextPage);
app.get('/lastPage/:movieIndex',movie.lastPage);*/
app.get('/index', function(req, res){
	res.render('index.ejs');
});

//Admin Login Page
app.get('/adminlogin', function(req, res){
	res.render('adminlogin.ejs');

});
//Admin Login Validated and Redirection to Home Page (admin)
app.post('/validate', fetchadmin.fetchdata);
//Admin Logout
app.get('/logout', fetchadmin.logout);
//Admin Home Page (Shows Up only when logged in)
app.get('/admin_home', function(req, res){
	if(req.session.admin_fname != null){
		res.render('admin_home', {
			admin_fname: req.session.admin_fname
		});
	} else {
		res.render('adminlogin',{
			error_message: "Please Login to Access",
			message: " ",
			member_id: ""
		});
	}
});

//User Registration Page
app.get('/userreg', function(req, res){
	res.render('userreg.ejs',{
		admin_fname: req.session.admin_fname});

});
//User registration method call
app.post('/user_registration', adduser.insert);

//Movie Addition Page
app.get('/registermovie', function(req, res){
	if(req.session.admin_fname != null){
		res.render('registermovie', {
			admin_fname: req.session.admin_fname
		});
	} else {
		res.render('registermovie',{
			error_message: "Please Login to Access this page",
			message: " ",
			member_id: ""
		});
	}
});
//Movie Add Method call
app.post('/add_movie', addmovie.insertmovie);

//Client side user login page
app.get('/userlogin',loginMgmt.loginPage);
//Client side user login page
app.get('/user_logout',loginMgmt.user_logout);
//Client side login method
app.post('/login',loginMgmt.auth);
//Client Profile Page
app.get('/profile', function(req, res){
	if(req.session.user_fname != null){
		res.render('profile', {
			user_fname:req.session.user_fname, 
			user_member_id:req.session.member_id,
			member_details: req.session.user_details,
			movie_details: req.session.movie_details
		});
	} else {
		res.render('userlogin', {title: 'Login', layout:false, locals: { errorMessage: "Invalid Login. Try again."}});
	}
});
//Client Side Change Password 
app.post('/changepass',profile.changepassworddb);
//Client Side Profile Page
app.get('/changepass',profile.changepassword);

/*app.get('/changepassword', function(req,res){
	console.log("Session at Change Pwd: : ", req.session.user_fname);
	res.render('changepassword',{
		user_fname:req.session.user_fname, 
		user_member_id:req.session.user_member_id,
	});
});*/


//To handle movie details: Show specific movie details, Update movie, Delete movie, and Add to cart. 
app.get('/movie/show/:m_id', movie.show);
app.post('/movie/update/:m_id', movie.update);
app.post('/movie/delete/:m_id', movie.unPublish);
app.post('/movie/cart/add/:m_id', cart.add);
app.get('/movie/cart/remove/:m_id', cart.remove);
app.get('/movie/cart/show', cart.view);
app.post('/movie/cart/clear', cart.clearCart);
app.post('/confirmOrder', cart.confirmOrder);



//Member Search Results Page
app.post('/searchuser/:userIndex',searchuser.searchuser);
//List users who rented particular movie
app.post('/listRentedMembers/:mid',searchuser.listRentedMembers);




//Member Details Page
app.get('/member_details', function(req, res){
	mysql_member_details.fetch_details(function(err,result1){
		console.log("Member Details: ", result1);
		if(err){
			throw err;
		}
		else {
			mysql_member_details.fetch_history(function(err,result2){
				console.log("Member History 1: ", result1);
				console.log("Member History 2: ", result2);

				if(err){
					throw err;
				}else{
					res.render('member_details.ejs',
							{title: "Member Details",
						results : result1,
						results1: result2
							});
				}
			},req.param("id"));

		}
	},req.param("id"));

});

//Return a movie held by user
app.post('/returnmovie', returnmovies.returnmovie);


//Delete Customer Details
app.get('/deleteuser', mysql_member_details.deleteuser);

//Edit Customer Details
app.post('/user/update', function(req, res){
	mysql_member_details.update_customer(req.param("user_id"),req.param("f_name"),req.param("l_name"),req.param("email"),req.param("street"),req.param("city"),req.param("state"),req.param("zipcode"));
	res.redirect(req.get('referer'));
});

