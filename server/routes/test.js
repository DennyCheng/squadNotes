var express = require('express');
var router = express.Router();
var pg = require('pg');
var NodeGeocoder = require('node-geocoder');
var connection = 'postgres://localhost:5432/omicron';


var options = {
  provider: 'google',
  // Optional depending of the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyDrTMzwjofj3pg4Z4wicyU277BvSlUJ0GE', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);

router.post('/', function(req, res, next) {
  //we have access to req,res and put anything onto them and send them to the next
  //matched file which is the next thing that matches (post(/)); which is the post to the Data base
  //do the api request here and next to the post to the server
  //We are controlling the process of middleware

//this first processes the inital API request and translates the address
//into lat/long and I add that to my req.body so i can store it on my DB in one request
//the reason we do this is because this res or response back from the API is scoped to only
//aviable to this post request, for us to "pass" this onto our database post reuquest
//we have to explicity call next(); within the response scope (line 35-40) so the next request
//will have access to the res of the api, if not the scope is dropped and the res is lost.

  var address = req.body
  address.latitude = 0;
  address.longitude = 0;

  geocoder.geocode(address.address, function(err, res) {
    address.latitude = res[0].latitude
    address.longitude = res[0].longitude
    console.log('before 2nd post',res);/
      next();
    });
});




router.post('/', function(req, res) {
  //if you console.log(req.body) it should match the res being sent back from your API
  //by passing the res to the next post, the post to the DB has access now to the res information from the API.
  console.log(req.body);
  var address = req.body
      pg.connect(connection, function(err, client, done) {
        if(err) {
          console.log(err);
          res.sendStatus(500);
        }
        client.query("INSERT INTO useraddress (address,latitude,longitude)VALUES($1,$2,$3)",
          [address.address,address.latitude,address.longitude],
          function(err, result) {
            done();

            if(err) {
              console.log("query error: ", err);
              res.sendStatus(500);
            }
            // created!
            res.sendStatus(201);
        });
      });
});

module.exports = router;
