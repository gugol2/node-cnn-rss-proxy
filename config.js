'use strict'

var configuration={
	getSecret:getSecret,
	getCustomLoggerDir: getCustomLoggerDir,
	setNodeEnv:setNodeEnv,
	getPort: getPort
};

var secret= 'whateverlongisagoodsecret';

var customLoggerDir= {
	'info': './logs/info.log',
	'error': './logs/error.log'
};

var port=3000;


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

function getPort() {
	return port;
};


module.exports=configuration;



