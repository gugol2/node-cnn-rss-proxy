'use strict'

//export the router
module.exports = function (express) {
	//This is a router
	var router = express.Router();

	//Install MW"s
	router.get("/", function(req, res) {

		res.json(
			{ 
				message: "This is node proxy to fetch XML feeds from the CNN rss service and return JSON."
			}
		);  		
		
	});

	return router;
}

