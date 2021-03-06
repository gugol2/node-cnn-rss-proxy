'use strict'

//export the express app
module.exports = function (config, customLoggerModule) {
  //Import dependencies
  var express = require('express');
  var path = require('path');
  var morgan = require('morgan'); 

  //get the custom logger itself
  var customLogger= customLoggerModule.getCustomLogger();

  //Import routers
  var info = require('./routes/info')(express);
  //require rss passing it express, the config, the customLogger itself
  var rss = require('./routes/rss')(express, config, customLogger);

  //Install express
  var app = express();

  //Install morgan in the app and use the customLogger as the stream option
  customLogger.debug("Overriding 'Express' logger");
  //Standard Apache combined log output.
  //format login is--> :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
  app.use(require('morgan')("combined", { "stream": customLoggerModule.stream }));

  //Middleware to set conditions for all requests
  // Enable Cross Origin Resource Sharing
  app.all('*', function(req, res, next) {
    res.set('X-Powered-By', 'Proxy CNN rss');
    res.header("Access-Control-Allow-Origin", "*"); // It can be restricted to the required domain
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'x-access-token');
    next();
  });

  //Short-Circuit favicon requests
  app.get('/favicon.ico',function(req, res, next){
    res.set({'Content-Type': 'image/x-icon'});
    res.status(200).end();
    customLogger.debug('favicon requested');
  });

  // Register routers
  //To show info about the api (does not need authenctication)
  app.use('/', info);

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
          //send the message of the error, the status and the error
          res.json({responseData: err.message, responseStatus: res.statusCode, "error":err}); 
          customLogger.error(err, { status: res.statusCode });
      });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      //send the error message and the status
      res.json({responseData: err.message, responseStatus: res.statusCode}); 
      customLogger.error(err, { status: res.statusCode });
  });
  return app;
}
