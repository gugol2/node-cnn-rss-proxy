var should= require('should');
var supertest = require('supertest');

describe('rss routes', function () {
  var server;

  //Clean server for each test (it can produce memory leaks)
  /*beforeEach(function () {
    //delete require cache to force the full 'init.js' reload
    delete require.cache[require.resolve('../../init')];
    server = require('../../init');
  });

  afterEach(function (done) {
    server.close(done);
  });*/

  //less strict but safer for memory leaks
  before(function () {
    server = require('../../init');
  });

  after(function (done) {
    server.close(done);
  });


  //All the routes in this route precise authentication
  
  // GET /rss

  //token provided
  it('should respond to an authenticated path that does not require the url parameter with status 200 and a message', function (done) {
    supertest(server)
      .get('/rss?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHAiOiJhbmd1bGFyLXZpZGVvcG9kY2FzdCIsImlkIjoiMTI1IiwiaWF0IjoxNDY2NTMwMTM1fQ.ChOtnTIc828YQFgZCc25z1wOI7FavilFae2gRTSSWnw')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        res.should.be.json;
        res.status.should.equal(200);
        done();
      })
  });

  //token not provided
  it('should respond to an unauthenticated path with status 403 and a message', function testPath(done) {
    supertest(server)
      .get('/rss')
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err);
        res.should.be.json;
        res.status.should.equal(403);
        done();
      })
  });


  // GET /rss/...

  //token & url provided
  it('should respond to an authenticated path with a required valid url parameter with status 200 and a message', function (done) {
    supertest(server)
      .get('/rss/feed?url=rss.cnn.com/services/podcasting/studentnews/rss&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHAiOiJhbmd1bGFyLXZpZGVvcG9kY2FzdCIsImlkIjoiMTI1IiwiaWF0IjoxNDY2NTMwMTM1fQ.ChOtnTIc828YQFgZCc25z1wOI7FavilFae2gRTSSWnw')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        res.should.be.json;
        res.status.should.equal(200);
        done();
      })
  });

  //token & !url provided
  it('should respond to an authenticated path without the required url parameter with status 400 and a message', function (done) {
    supertest(server)
      .get('/rss/feed?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHAiOiJhbmd1bGFyLXZpZGVvcG9kY2FzdCIsImlkIjoiMTI1IiwiaWF0IjoxNDY2NTMwMTM1fQ.ChOtnTIc828YQFgZCc25z1wOI7FavilFae2gRTSSWnw')
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err);
        res.should.be.json;
        res.status.should.equal(400);
        done();
      })
  });

  //token & invalid response url provided
  it('should respond to an authenticated path with a required invalid response url parameter with status 500 and a message', function (done) {
    supertest(server)
      .get('/rss/feed?url=cnn.com&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHAiOiJhbmd1bGFyLXZpZGVvcG9kY2FzdCIsImlkIjoiMTI1IiwiaWF0IjoxNDY2NTMwMTM1fQ.ChOtnTIc828YQFgZCc25z1wOI7FavilFae2gRTSSWnw')
      .expect(500)
      .end(function (err, res) {
        if (err) return done(err);
        res.should.be.json;
        res.status.should.equal(500);
        done();
      })
  });

  //token & not found url provided
  it('should respond to an authenticated path with a required valid url parameter not found with status 404 and a message', function (done) {
    supertest(server)
      .get('/rss/feed?url=rss.cnn.com/services/podcasting/studentnews/rss/404&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHAiOiJhbmd1bGFyLXZpZGVvcG9kY2FzdCIsImlkIjoiMTI1IiwiaWF0IjoxNDY2NTMwMTM1fQ.ChOtnTIc828YQFgZCc25z1wOI7FavilFae2gRTSSWnw')
      .expect(404)
      .end(function (err, res) {
        if (err) return done(err);
        res.should.be.json;
        res.status.should.equal(404);
        done();
      })
  });


  /*------------------------*/

  //invalid token & url provided
  it('should respond to an authenticated path with an invalid token and a required valid url parameter with status 401 and a message', function (done) {
    supertest(server)
      .get('/rss/feed?url=rss.cnn.com/services/podcasting/studentnews/rss&token=1eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHAiOiJhbmd1bGFyLXZpZGVvcG9kY2FzdCIsImlkIjoiMTI1IiwiaWF0IjoxNDY2NTMwMTM1fQ.ChOtnTIc828YQFgZCc25z1wOI7FavilFae2gRTSSWnw')
      .expect(401)
      .end(function (err, res) {
        if (err) return done(err);
        res.should.be.json;
        res.status.should.equal(401);
        done();
      })
  });

  //invalid token & !url provided
  it('should respond to an authenticated path with an invalid token and a required valid url parameter with status 401 and a message', function (done) {
    supertest(server)
      .get('/rss/feed?token=1eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHAiOiJhbmd1bGFyLXZpZGVvcG9kY2FzdCIsImlkIjoiMTI1IiwiaWF0IjoxNDY2NTMwMTM1fQ.ChOtnTIc828YQFgZCc25z1wOI7FavilFae2gRTSSWnw')
      .expect(401)
      .end(function (err, res) {
        if (err) return done(err);
        res.should.be.json;
        res.status.should.equal(401);
        done();
      })
  });

  //invalid token & invalid response url provided
  it('should respond to an authenticated path with an invalid token and an required invalid response url parameter with status 401 and a message', function (done) {
    supertest(server)
      .get('/rss/feed?url=cnn.com&token=1eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHAiOiJhbmd1bGFyLXZpZGVvcG9kY2FzdCIsImlkIjoiMTI1IiwiaWF0IjoxNDY2NTMwMTM1fQ.ChOtnTIc828YQFgZCc25z1wOI7FavilFae2gRTSSWnw')
      .expect(401)
      .end(function (err, res) {
        if (err) return done(err);
        res.should.be.json;
        res.status.should.equal(401);
        done();
      })
  });

  //invalid token & not found url provided
  it('should respond to an authenticated path with a required valid url parameter not found with status 401 and a message', function (done) {
    supertest(server)
      .get('/rss/feed?url=rss.cnn.com/services/podcasting/studentnews/rss/404&token=1eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHAiOiJhbmd1bGFyLXZpZGVvcG9kY2FzdCIsImlkIjoiMTI1IiwiaWF0IjoxNDY2NTMwMTM1fQ.ChOtnTIc828YQFgZCc25z1wOI7FavilFae2gRTSSWnw')
      .expect(401)
      .end(function (err, res) {
        if (err) return done(err);
        res.should.be.json;
        res.status.should.equal(401);
        done();
      })
  });

  /*----------------------------------------*/

  //!token & url provided
  it('should respond to an authenticated path without token and a required valid url parameter with status 403 and a message', function (done) {
    supertest(server)
      .get('/rss/feed?url=rss.cnn.com/services/podcasting/studentnews/rss')
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err);
        res.should.be.json;
        res.status.should.equal(403);
        done();
      })
  });

  //!token & !url provided
  it('should respond to an authenticated path without token and a required valid url parameter with status 403 and a message', function (done) {
    supertest(server)
      .get('/rss/feed')
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err);
        res.should.be.json;
        res.status.should.equal(403);
        done();
      })
  });

  //!token & invalid response url provided
  it('should respond to an authenticated path without token and an invalid response url parameter with status 403 and a message', function (done) {
    supertest(server)
      .get('/rss/feed?url=rss.cnn.com')
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err);
        res.should.be.json;
        res.status.should.equal(403);
        done();
      })
  });

  //!token & not found url provided
  it('should respond to an authenticated path without token a required valid url parameter not found with status 403 and a message', function (done) {
    supertest(server)
      .get('/rss/feed?url=rss.cnn.com/services/podcasting/studentnews/rss/404')
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err);
        res.should.be.json;
        res.status.should.equal(403);
        done();
      })
  });

  /*----------------------------------------*/



});
