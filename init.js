#!/usr/bin/env node
var app = require('./server');
var config= require('./config');
var customLogger = require("./utils/customlogger").getCustomLogger();


app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'));

customLogger.info('Express server listening on port ' + server.address().port);
/*console.log('NODE_ENV is: ' + process.env.NODE_ENV || "set NODE_ENV in your system");*/

customLogger.info('NODE_ENV is: ' + config.setNodeEnv(process.env.NODE_ENV) );


