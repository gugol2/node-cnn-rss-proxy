var winston = require('winston');
winston.emitErrs = true;
var config = require('./config'); // config file


var utils={
	setNodeEnv:setNodeEnv,
	/*customLogger2: {
		getCustomLogger: getCustomLogger,
		stream: write
	}*/
};

//set NODE_ENV variable
function setNodeEnv(value) {

	var nodeEnv;

    if (value === undefined) {
        nodeEnv = "set NODE_ENV in your system (production or a development)";
    }else{
    	nodeEnv=value;
    }

    return nodeEnv;
};

/*var customLogger2 = new winston.Logger({
    transports: [
        //info log
        new winston.transports.File({
            name: 'info-file',
            level: 'info',
            filename: config.customLogger2Dir.info,
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
            filename: config.customLogger2Dir.error,
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


function getCustomLogger() {
	return customLogger2;
};

var write={
	function stream(message, encoding){
    	customLogger2.info(message);
    };
};*/

module.exports=utils;
