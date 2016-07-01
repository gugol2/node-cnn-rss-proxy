'use strict'

var configuration={
	getSecret:getSecret,
	getCustomLoggerDir: getCustomLoggerDir,
	checkNodeEnv:checkNodeEnv,
	getPort: getPort,
	allowedApp:allowedApp
};

var secret= 'whateverlongisagoodsecret';

var customLoggerDir= {
	'info': './logs/info.log',
	'error': './logs/error.log'
};

var port=3001;

var allowedApps=['anvideopodcastcnn001'];


function getSecret() {
	return secret;
};

function getCustomLoggerDir() {
	return customLoggerDir;
};

//check the NODE_ENV variable
function checkNodeEnv(value) {

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

function getSecret() {
	return secret;
};

function allowedApp(value) {
	var index= allowedApps.indexOf(value);
	if(index>-1){
		return true;
	}else{
		return false;
	}
};



module.exports=configuration;



