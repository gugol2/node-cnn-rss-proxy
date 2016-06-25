var should= require('should');
var supertest = require('supertest');

describe('info routes', function () {
  var server;

  //Clean server for each test (it can produce memory leaks)
  /*beforeEach(function () {
    //delete require cache to force the full 'init.js' reload
    delete require.cache[require.resolve('../../init')];
    server = require('../../init');
  });
  
  //properly closing the server after each unit test
  afterEach(function (done) {
    server.close(done);
  });*/

  //less strict but safer for memory leaks
  before(function () {
    server = require('../../init');
  });

  after(function () {
    server.close();
  });


  //None of the routes in this route precise authentication
  
  // GET /
  it('should respond to a path that does not require any parameters nor token with status 200 and a message', function (done) {
    supertest(server)
      .get('/')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        res.should.be.json;
        res.status.should.equal(200);
        done();
      })
  });

  // POST /
  it('should respond to a POST request to a path that does not require any parameters nor a token with status 404 and a message', function (done) {
    supertest(server)
      .post('/')
      .expect(404)
      .end(function (err, res) {
        if (err) return done(err);
        res.should.be.json;
        res.status.should.equal(404);
        done();
      })
  });
  
});
