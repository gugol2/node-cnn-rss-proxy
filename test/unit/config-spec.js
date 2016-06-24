var should= require('should');

describe('config data', function () {

	var config= require('../../config');

	it('should get the secret key', function () {
		var secret= 'whateverlongisagoodsecret';

		var secretFromConfig=config.getSecret();

		secret.should.equal(secret);
	})

	it('should get the custom logger directory paths', function () {
		var loggerDirectoryPaths=config.getCustomLoggerDir();

		var customLoggerDir= {
			'info': './logs/info.log',
			'error': './logs/error.log'
		};

		loggerDirectoryPaths.should.have.properties('info', 'error');

		loggerDirectoryPaths.should.eql(customLoggerDir);
	})

	
	
});