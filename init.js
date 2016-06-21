#!/usr/bin/env node
var app = require('./server.js');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'));

console.log('Express server listening on port ' + server.address().port);
console.log('NODE_ENV is: ' + process.env.NODE_ENV);


