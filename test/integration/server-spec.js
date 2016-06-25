var should= require('should');
var supertest = require('supertest');

describe('server routes', function () {
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


  //server main routes
  
  // GET /favicon.ico
  it('should respond to the favicon.ico GET request with status 200', function (done) {
    supertest(server)
      .get('/favicon.ico')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        res.headers.should.have.property('content-type', 'image/x-icon');
        res.status.should.equal(200);
        done();
      })
  });


  // POST /favicon.ico
  it('should respond to the favicon.ico POST request with status 404', function (done) {
    supertest(server)
      .post('/favicon.ico')
      .expect(404)
      .end(function (err, res) {
        if (err) return done(err);
        res.headers.should.have.property('content-type', 'application/json; charset=utf-8');
        res.status.should.equal(404);
        done();
      })
  });


  // GET /foo/bar
  it('should respond to non-existing route request with status 404', function (done) {
    supertest(server)
      .get('/foo/bar')
      .expect(404)
      .end(function (err, res) {
        if (err) return done(err);
        res.headers.should.have.property('content-type', 'application/json; charset=utf-8');
        res.status.should.equal(404);
        done();
      })
  });


});