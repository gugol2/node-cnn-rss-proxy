# README #

This repo is about a comment node REST api. 
It has the following routes:

* Get all comments : GET /api/comments
* Get one comment by Id : GET /api/comments/:commentId(\\d+)
* Create a comment : 'POST /api/comments' passing the comment text in the 'text' property of the body
* Get all favorite comments for an user : GET /api/comments/favorites
* Mark/unmark a comment as favorite : PUT /api/comments/favorites/:commentId(\\d+)
				

### Features ###

* SQLite local DB
* Password hashing
* Token authentication 


### How do I get set up? ###

1. Clone repo
2. cd to the main repo folder
3. Install dependencies (node packages) --> `npm install`
4. Run `npm start` to start the app
5. Go to route "yourhost:3000/" and follow instructions
  * Note: Authentication uses token and can be pass in the body with 'token', in the query with the parameter 'token' or in the header as 'x-access-token'


### Live Demo ###

* [http://ec2-52-27-247-122.us-west-2.compute.amazonaws.com:3000/](http://ec2-52-27-247-122.us-west-2.compute.amazonaws.com:3000/)
* users:
	* username:user1 password:user1
	* username:user2 password:user2


### Who do I talk to? ###

* jsanchezcriado@gmail.com