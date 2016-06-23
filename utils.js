//set NODE_ENV variable

var utils={
	setNodeEnv:setNodeEnv
};

function setNodeEnv(value) {

	var nodeEnv;

    if (value === undefined) {
        nodeEnv = "set NODE_ENV in your system (production or a development)";
    }else{
    	nodeEnv=value;
    }

    return nodeEnv;
};

module.exports=utils;