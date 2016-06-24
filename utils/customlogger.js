'use strict'

function createCustomLogger(config) {
    var winston = require('winston');
    winston.emitErrs = true;
    //var config = require('../config'); // config file

    var customLoggerModule={
        getCustomLogger:getCustomLogger,
        stream: stream
    }


    var winstonLogger = new winston.Logger({
        transports: [
            //info log
            new winston.transports.File({
                name: 'info-file',
                level: 'info',
                filename: config.getCustomLoggerDir().info,
                handleExceptions: true,
                json: true,
                maxsize: 5242880, //5MB
                maxFiles: 5,
                colorize: false
            }),
            //error log
            new winston.transports.File({
                name: 'error-file',
                level: 'error',
                filename: config.getCustomLoggerDir().error,
                handleExceptions: true,
                json: true,
                maxsize: 5242880, //5MB
                maxFiles: 5,
                colorize: false
            }),
            //console log
            new winston.transports.Console({
                level: 'debug',
                handleExceptions: true,
                json: false,
                colorize: true
            })
        ],
        exitOnError: false
    });

    function getCustomLogger(){
        return winstonLogger;
    };

    var stream={
        write: function (message, encoding){
            winstonLogger.info(message);
        }
    };

    return customLoggerModule;
}

module.exports = createCustomLogger;





