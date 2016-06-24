'use strict'

var configuration={
	getSecret:getSecret,
	getCustomLoggerDir: getCustomLoggerDir,
	setNodeEnv:setNodeEnv
};

var secret= 'whateverlongisagoodsecret';

var customLoggerDir= {
	'info': './logs/info.log',
	'error': './logs/error.log'
};


function getSecret() {
	return secret;
};

function getCustomLoggerDir() {
	return customLoggerDir;
};

//check NODE_ENV value
function setNodeEnv(value) {

	var nodeEnv;

    if (value === undefined) {
        nodeEnv = "set NODE_ENV in your system (production or a development)";
    }else{
    	nodeEnv=value;
    }

    return nodeEnv;
};


module.exports=configuration;



