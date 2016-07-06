# README #

This repo describes a rss proxy for the CNN made with node. 
It has the following routes:

* Get info : GET /
* Get json feed result : GET /rss/feed?url=feedUrl&token=token OR  GET /rss/feed?url=feedUrl (and the token in the header)
* Get a new token : GET rss/newtoken?token=token&[secret=secret]&appid=appid OR  GET rss/newtoken?[secret=secret]&appid=appid (and the token in the header)
				

### Features ###

* Token authentication (just to protect the proxy)
* Logging management
* Unit and Integration tests


### How do I get set up? ###

1. cd to the main repo folder
2. Install dependencies (node packages) --> `npm install`
4. Run `npm start` or `node init.js` to start the app
5. Run `npm test` to test the app with mocha
5. Go to route "yourhost:3001/" and follow instructions
  * Note: Authentication uses token and can be pass in the query with the parameter 'token' or in the header as 'x-access-token'


### Live Demo ###

* [https://node-cnn-rss-proxy.herokuapp.com/](https://node-cnn-rss-proxy.herokuapp.com/)
* token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHBJZCI6ImFudmlkZW9wb2RjYXN0Y25uMDAxIiwiaWF0IjoxNDY3Mzc1MjQyfQ.SY-Ox_xZS7kHRVRxg4Et8vEqoGqLkK53t9f4mVcacBY'
* appid: 'anvideopodcastcnn001'


