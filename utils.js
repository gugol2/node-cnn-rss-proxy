//set NODE_ENV variable
exports.setNodeEnv=function (value) {
	var nodeEnv;

    if (value === undefined) {
        nodeEnv = "set NODE_ENV in your system (production or a development)";
    }else{
    	nodeEnv=value;
    }

    return nodeEnv;
};