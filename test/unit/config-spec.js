'use strict'

var should= require('should');
var config= require('../../config');

describe('config data', function () {

	it('should get the secret key from the config file', function () {

		var secretFromConfig=config.getSecret();

		//not '', null, undefined, 0 , NaN, false
		secretFromConfig.should.be.ok;
	});


	it('should get the custom logger directory paths from the config file', function () {
		
		var loggerDirectoryPaths=config.getCustomLoggerDir();


		loggerDirectoryPaths.should.have.properties('info', 'error');

		//not '', null, undefined, 0 , NaN, false
		loggerDirectoryPaths.should.be.ok;
	});

	it('should check the NODE_ENV variable', function () {

		var value, nodeEnv;
		
		value= undefined;

		nodeEnv=config.checkNodeEnv(value);

		nodeEnv.should.startWith('set');
		//not '', null, undefined, 0 , NaN, false
		nodeEnv.should.be.ok;



		value= !undefined;

		nodeEnv=config.checkNodeEnv(value);
		//not '', null, undefined, 0 , NaN, false
		nodeEnv.should.be.ok;

	});


	it('should get the port of the app from the config file', function () {

		var port=config.getPort();

		//not '', null, undefined, 0 , NaN, false
		port.should.be.ok;

	});


	it('should return true if the value passed is in the allowedApps array', function () {

		var validAppId='anvideopodcastcnn001';

		var boolean= config.allowedApp(validAppId);

		boolean.should.be.true;
		
	});

	it('should return false if the value passed is NOT in the allowedApps array', function () {

		var invalidAppId='anvideopodcastcnn002';

		var boolean= config.allowedApp(invalidAppId);

		boolean.should.be.false;
		
	});

	
	
});