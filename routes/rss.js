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
	          customLogger.verbose(decoded);
	          if(decoded.app==='angular-videopodcast' && decoded.id==='125'){
	          	next();
	          }else{
	          	var err = new Error("The token does not have the right information");
	          	//pass error to the next Error MW 
	          	next(err); 
	          }
	          
	          
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


	//Get url feed data
	//GET /feed?url=httpurl
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
				var err = new Error("Requested url failed");
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
			res.json({responseData: result, responseStatus: res.statusCode});				
		}

		//Check if the path contains the parameter url
		if(req.query && req.query.url){

			var url= req.query.url;

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


	return router;
}


