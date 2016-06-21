//This is a router
var express = require("express");
var router = express.Router();
var util= require('util');
var http = require('http');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();


//Install MW"s

//Get info from the api
//GET /api
router.get("/", function(req, res) {
	res.json(
	{ 
		message: "All the routes in this route precise authentication",
		usage: "Authentication uses token and can be pass: in the body, in the query or in the header as 'x-access-token'",
		routes: { 
			"Get all comments" : "GET /api/comments",
			"Get one comment by Id" : "GET /api/comments/:commentId(\\d+)",
			"Create a comment" : "'POST /api/comments' passing the comment text in the 'text' property of the body",
			"Get all favorite comments for an user" : "GET /api/comments/favorites",
			"Mark/unmark a comment as favorite" : "PUT /api/comments/:commentId(\\d+)"
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





//Get one comment by Id
//GET /api/comments/:commentId(\\d+)
router.get("/feed",function(req, res, next) {

	parser.on('error', function(err) { console.log('Parser error', err); });

	var data = '';

	var resultado;
	var jsonResutl;

	if(req.query && req.query.url){
		var url= 'http://'+req.query.url;

		console.log(url);
	
		http.get(url, function(respuesta) {

			if(respuesta.statusCode >= 200 && respuesta.statusCode < 400) {

				console.log("status: -->"+respuesta.statusCode);

				respuesta.on('data', function(data_) { data += data_.toString(); });
				respuesta.on('end', function() {
					//console.log('data', data);
					parser.parseString(data, function(err, result) {
						console.log('FINISHED', err, result);
						//console.log(util.inspect(result, false, null));
						//console.log('-------------');
						jsonResutl= JSON.stringify(result.rss.channel);

						//console.log(jsonResutl);
						console.log("*******************************");

						resultado=result.rss.channel;
						res.json(resultado);
					});
				});

				respuesta.on('error', function (error) {
					console.log("Error meeehhh!!!" +error);
				});

			}else{
				var err = new Error("Failed url: " +url);
				err.status = respuesta.statusCode;
				next(err);
				console.log("Error meeehhh!!!" +err);
			}

		});

	}else{
		var err = new Error("the param is not correct");
		err.status = 601;
		console.log("Error meeehhh!!!" +err);
		next(err);
	}
	
	console.log("U reached me!!!")	

});

app.get("/newtoken", function(req, res) {

  	// It we wanted to create another token
    var token = jwt.sign(
        {app:'angular-videopodcast', id:'125'}, 
        app.get('secretKey')
    );

    // return the information including token as JSON
    res.json({
        success: true,
        token: token,
        "expiration time":"none"
    }); 
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