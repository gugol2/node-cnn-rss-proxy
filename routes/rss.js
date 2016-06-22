//This is a router
var express = require("express");
var router = express.Router();
var util= require('util');
var http = require('http');
var xml2js = require('xml2js');


//Install MW"s

//Get info from the api
//GET /api
router.get("/", function(req, res) {
	res.json(
		{ 
			message: "All the routes in this route precise authentication",
			usage: "Authentication uses token and can be pass: in the body, in the query or in the header as 'x-access-token'",
			routes: { 
				"Get json feed result" : "GET /rss/feed?url=feedUrl",
				"Get a new token" : "GET rss/newtoken"
			}
		}  
	);
});


//Autoload the userId from the authentication decoded token
router.use(function(req,res,next){
	//Gets the userId from the token to pass it to the next MW's of this api route
	req.userId=req.decoded.id;
	next();

});

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

//To create a different token
router.get("/newtoken", function(req, res) {

  	// It we wanted to create another token
    var token = jwt.sign(
        {app:'angular-videopodcast', id:'125'}, 
        router.get('secretKey')
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

	if(req.query && req.query.url){
		var url= 'http://'+req.query.url;

		console.log("url is:" +url);
	
		var reqToFeed=http.get(url, function(resFromFeed) {

			if(resFromFeed.statusCode >= 200 && resFromFeed.statusCode < 400) {

				resFromFeed.setEncoding('utf8');

				console.log("status: -->"+resFromFeed.statusCode);

				resFromFeed.on('data', function(data_) { data += data_.toString(); });
				resFromFeed.on('end', function() {
					//console.log('data', data);
					parser.parseString(data, function(err, result) {

						if(err){
							console.log('Error when parsing response from feed', err); 
							next(err);

						}else{
							console.log('FINISHED', err, result);
							//console.log(util.inspect(result, false, null));
							//console.log('-------------');
							jsonResutl= JSON.stringify(result.rss.channel);

							//console.log(jsonResutl);
							console.log("*******************************");

							resultado=result.rss.channel;
							res.json(resultado);
						}
						
					});

					//if parser error handle parser error 
					parser.on('error', function(err) { 
						console.log('Parser error', err); 
						next(err);
					});
				});

				//if resFromFeed error handle it
				resFromFeed.on('error', function (err) {
					console.log("Error when !!!" +err);
					next(err);
				});

			}else{
				console.log("Error when calling the url parameter!!!" +resFromFeed.statusCode);
				var err = new Error("Failed url: " +url);
				err.status = resFromFeed.statusCode;
				next(err);
				
			}

		});

		reqToFeed.on('error', function (error) {
			console.log("Error when !!!" +error);
			next(error);
		});

	}else{
		var err = new Error("the query url param is missing or empty");
		err.status = 409;
		next(err);
	}
	
	console.log("U reached me!!!")	

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




//export the router
module.exports = router;