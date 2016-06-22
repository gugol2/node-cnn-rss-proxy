#!/usr/bin/env node
var app = require('./server.js');
var utils= require('./utils.js');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'));


console.log('Express server listening on port ' + server.address().port);
/*console.log('NODE_ENV is: ' + process.env.NODE_ENV || "set NODE_ENV in your system");*/

console.log('NODE_ENV is: ' + utils.setNodeEnv(process.env.NODE_ENV) );


