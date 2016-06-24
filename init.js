#!/usr/bin/env node
var config= require('./config');
//require customLoggerModule passing it the config
var customLoggerModule = require("./utils/customlogger")(config);
//require app passing it the config and the customLoggerModule
var app = require('./server')(config, customLoggerModule);

//get the custom logger itself
var customLogger= customLoggerModule.getCustomLogger();

app.set('port', process.env.PORT || config.getPort());

//start server
var server = app.listen(app.get('port'));

customLogger.info('Express server listening on port ' + server.address().port);

customLogger.info('NODE_ENV is: ' + config.checkNodeEnv(process.env.NODE_ENV) );


module.exports = server;