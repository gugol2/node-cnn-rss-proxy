'use strict'

//export the router
module.exports = function (express, config, customLogger) {
	//This is a router
	var router = express.Router();
	//allows deeper Objects console loging
	var util= require('util');
	var http = require('http');
	var xml2js = require('xml2js');
	var jwt    = require('jsonwebtoken'); //create, sign, and verify tokens


	//Install MW"s


	//Check authentication token
	router.get("*", function(req, res, next) {

	//Check header or url parameters or post parameters for token
	var token = req.query.token || req.headers['x-access-token'];
	//Decode token
	if (token) {

	    //Verifies secret and checks expression (ignores if token expirates)
	    jwt.verify(token, config.getSecret(), {ignoreExpiration: true}, function(err, decoded) {      
	        if (err) {
	          err.status = 401;
	          //pass error to the next Error MW 
	          next(err);  
	        } else {
	          //If everything is good, save to request for use in other routes
	          req.decoded = decoded;
	          customLogger.info(decoded);
	          //pass error to the next Error MW 
	          next();
	        }
	    });

	    } else {
	      //If there is no token return an error
	      var err = new Error("No token provided. Provide a token in the query(token) or in the headers(x-access-token)");
	      err.status = 403;
	      //pass error to the next Error MW 
	      next(err);    
	    }
	});

	//Get info from the api
	//GET /api
	router.get("/", function(req, res) {
		res.json(
		{ 
			message: "All the routes in this route precise authentication",
			usage: "Authentication uses token and can be pass in the query or in the header as 'x-access-token'",
			routes: { 
				"Get json feed result" : "GET /rss/feed?url=feedUrl&token=token OR  GET /rss/feed?url=feedUrl (and the token in the header)",
				"Get a new token" : "GET rss/newtoken?token=token OR  GET rss/newtoken (and the token in the header)"
			}
		}  
		);
	});


	//Autoload the userId from the authentication decoded token
	/*router.use(function(req,res,next){
		//Gets the userId from the token to pass it to the next MW's of this api route
		req.userId=req.decoded.id;
		next();

	});*/

	//Autoload a comment if the path contains the ":commentId(\\d+)" parameter
	//CommentId must be a number > 0
	/*router.param("commentId",function(req,res,next,commentId){
		
		//Find the comment by id or if not it returns null
		models.Comment.find({where:{id:Number(commentId)}}).then(
			function(comment){
				console.info(comment);
				if(comment){
					req.comment=comment;
					next();
				}else{
					var err=new Error('Comment does not exist in DB, commentId: ' +commentId);
					err.status = 404;
					next(err);
				}
			}
		).catch(function(error){
			next(error);
		})
	});*/


	//Get all comments
	//GET /api/comments
	/*router.get("/comments", function(req, res, next) {
		//Receives req.userId from the autoload
		
		//Fecht all comments from DB
		models.Comment.findAll().then(function(comments){

			//comments is an array of "Comment" instances
			//res.json({"comments":comments});
			if(comments.length>0){
				res.json({"comments":comments});
			}else{
				var err=new Error("There are not any comments in the DB");
				err.status = 404;
				next(err);
			}
		//If error catch it and pass it to the error MW	
		}).catch(function(error){
			next(error);
		});

	});*/


	/*To create a different token from a passed query parameter (secret)
	or from the default secret if nothing passed*/
	router.get("/newtoken", function(req, res) {

		var newSecretKey;

		if(req.query && req.query.secret){
			newSecretKey=req.query.secret;
		}else{
			newSecretKey=config.getSecret();
		}

		// It we wanted to create another token
		var token = jwt.sign(
		  	{app:'angular-videopodcast', id:'125'}, 
		  	newSecretKey
		);

		// return the information including token as JSON
		res.json({
		    success: true,
		    token: token,
		    "expiration time":"none"
		}); 
	});


	//Get one comment by Id
	//GET /api/comments/:commentId(\\d+)
	router.get("/feed",function(req, res, next) {

		var parser = new xml2js.Parser();

		var data = '';

		var resultado;
		var jsonResutl;

		var callbackGetFeed=function(resFromFeed) {

			if(resFromFeed.statusCode >= 200 && resFromFeed.statusCode < 400) {

				//set encoding for the XML response
				resFromFeed.setEncoding('utf8');

				resFromFeed.on('data', function(XMLdata) { 
					// buffer the entire data response
					data += XMLdata.toString(); 
				});
				resFromFeed.on('end', function() {
					//when response ends sending, then we parse XML
					parser.parseString(
						data, 
						callbackProcessXML						
					);

					//if xml2js parser error handle parser error 
					parser.on('error', function(error) { 
						var err = new Error('xml2js parser error-->'+error);
						//pass error to the next Error MW 
						next(err);
					});
				});

				//if resFromFeed error handle it
				resFromFeed.on('error', function (error) {
					var err = new Error("Error when reading the XML feed response-->"+error);
					//pass error to the next Error MW 
					next(err);
				});

			}else{
				var err = new Error("Requested url failed. Status: "+resFromFeed.statusCode);
				err.status = resFromFeed.statusCode;
				//pass error to the next Error MW 
				next(err);
					
			}

		}

		//Process the XML result from the feed
		var callbackProcessXML=function(error, result) {

			//error parsing the reponse from the feed
			if(error){
				var err = new Error('Error when parsing response from feed-->'+error);
				//pass error to the next Error MW 
				next(err);

			}else{
				//customLogger.debug('FINISHED', error, result);

				//console.log(util.inspect(result, false, null));
				//console.log('-------------');

				jsonResutl= JSON.stringify(result.rss.channel);

				resultado=result.rss.channel;
				
				sendResultJSON(resultado);
			}

		}

		//send the resutl passed in as JSON
		function sendResultJSON(result) {
			res.json(result);				
		}

		//Check if the path contains the parameter url
		if(req.query && req.query.url){

			var url= 'http://'+req.query.url;

			customLogger.debug("url is:" +url);

			var reqToFeed=http.get(url, callbackGetFeed);

			reqToFeed.on('error', function (error) {
				var err = new Error("Error when requesting the query url parameter:" +url+ "-->" +error);
				//pass error to the next Error MW 
				next(err);
			});

		}else{
			var err = new Error("the query url parameter is missing or empty");
			err.status = 400;
			//pass error to the next Error MW 
			next(err);
		}


	});




	/*//Get all favorite comments for an user
	//GET /api/comments/favorites
	router.get("/comments/favorites", function(req, res, next) {
		//Receives req.userId from the autoload

		//Find the favorites of the :userId
		var userid=req.userId;

		models.Favorite.findAll({
			attributes: ['CommentId'],
			where:{
				UserId: userid
			}
		}).then(function(favorites){
			console.log("number of favorites:" +favorites.length);
			//If :userId has any favorite save their CommentId's in an array
			if(favorites && favorites.length>0){
				var commentids= [];
				for (favorite in favorites){
					commentids.push(favorites[favorite].CommentId);
				}
				console.info(commentids);

				//Find the comments by their id's
				models.Comment.findAll({
					where:{
						Id: {
							$in:commentids
						}
					}
				}).then(function(favoritecomments){
					//Send result of the creation
					res.json({"favorite comments":favoritecomments});
				}).catch(function(error){
					next(error);
				});
			//If :userId has no favorite
			}else{
				var err = new Error('User with userId '+userid+" does not have any favorite comments");
				err.status = 404;
				next(err);
			}
		console.info(favorites);
		});
	});*/
	return router;
}


