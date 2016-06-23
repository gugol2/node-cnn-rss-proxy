//Import dependencies
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan'); 
var jwt    = require('jsonwebtoken'); //create, sign, and verify tokens
var config = require('./config'); // config file
//var models = require('./models/models.js');
//var bcrypt = require('bcrypt'); //To hash passwords and verify hashed passwords


//Import routers
var info = require('./routes/info');
var rss = require('./routes/rss');

//Install express
var app = express();

//set the secret key
app.set('secretKey', config.secret);

//Install morgan in the app
app.use(morgan('dev'));

//Install modules
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Middleware to set conditions for all requests
// Enable Cross Origin Resource Sharing
app.all('*', function(req, res, next) {
  res.set('X-Powered-By', 'Proxy CNN rss');
  res.header("Access-Control-Allow-Origin", "*"); // It can be restricted to the required domain
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,x-access-token');
	next();
});

//Short-Circuit favicon requests
app.use('/favicon.ico',function(req, res, next){
  res.set({'Content-Type': 'image/x-icon'});
  res.status(200).end();
  console.log('favicon requested');
});

// Register routers
//To show info about the api (does not need authenctication)
app.use('/', info);

//Authenticate user raute
//POST /api/authenticate
/*app.post('/api/authenticate', function(req, res, next) {
  	//Find the user
  	models.User.findOne({ where: {username: req.body.username} }) //Returns an object user or null
 	.then(function(user) {
 		//If the user is not in the DB
	  	if (!user) {
	  		res.json({ success: false, message: 'Authentication failed. User does not exist.' });
	  	} else {
	        // check if password matches with the stored hash
	        bcrypt.compare(req.body.password, user.password, function(err, comparation) {
			    if(err){
			    	next(err);
			    }
			    else if(comparation){
			        // If user is found and password is right create a token
			        var token = jwt.sign(
			        	{username:user.username, id:user.id}, 
			        	app.get('secretKey'), 
			        	{
			          		expiresIn: '1d' // expires in 24 hours
			      		}
			      	);

			        // return the information including token as JSON
			        res.json({
			        	success: true,
			        	token: token,
			        	"expiration time":"1 day"
			        });
			    //If the password does not match with the stored hash
	    		}else{
	    			res.json({ success: false, message: 'Authentication failed. Wrong password.' });
	    		}  

			});
	    }
	}).catch(function(error){
		next(error);
	});		
});*/



//Check authentication token
app.use(function(req, res, next) {

  //Check header or url parameters or post parameters for token
  var token = req.query.token || req.headers['x-access-token'];
  //Decode token
  if (token) {

    //Verifies secret and checks expression (ignores if token expirates)
    jwt.verify(token, app.get('secretKey'), {ignoreExpiration: true}, function(err, decoded) {      
      if (err) {
        err.status = 401;
        //pass error to the next Error MW 
        next(err);  
      } else {
        //If everything is good, save to request for use in other routes
        req.decoded = decoded;
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

// Register routers
//All of our user authenticated routes will be prefixed with /api
app.use('/rss', rss);

// Other paths triggers a 404 error and forward it to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    //pass error to the next Error MW 
    next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
    	//If the error has no status, the status of the error will be 500
        res.status(err.status || 500);
        //send the error, the status and the message of the error
        res.json({"error":[{"err":err, "status":res.statusCode, "message":err.message}]});
        console.log(err);
        console.log(res.statusCode);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    //send the error, the status and the message of the error
    res.json({"error":[{"status":res.statusCode, "message":err.message}]});
});

//export the express app
module.exports = app;
