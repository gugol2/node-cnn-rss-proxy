var winston = require('winston');
winston.emitErrs = true;
var config = require('./config'); // config file

var customLogger = new winston.Logger({
    transports: [
        /*info log*/
        new winston.transports.File({
            name: 'info-file',
            level: 'info',
            filename: config.customLoggerDir.info,
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        /*error log*/
        new winston.transports.File({
            name: 'error-file',
            level: 'error',
            filename: config.customLoggerDir.error,
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        /*console log*/
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

module.exports = customLogger;
module.exports.stream = {
    write: function(message, encoding){
        customLogger.info(message);
    }
};