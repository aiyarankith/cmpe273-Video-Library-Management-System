
/*
 * GET home page.
 */

exports.index = function(req, res){
	if ( typeof req.session.username == 'undefined' || req.session.username === null) {
		res.render('index', { titile: 'A2Z', layout:false, locals: { username: req.session.username, message: null}});
		console.log("Guest user browing...");
	} else {
		res.render('index', { titile: 'A2Z', layout:false, locals: { username: req.session.username, message: null}});
		console.log("Browsing user:" + req.session.username);
	}
};
