var express = require('express');
var bodyParser = require('body-parser');
// var mongoose = require('mongoose');
var path = require('path');
var request = require('request');
var fs = require('fs');

// mongoose.connect(process.env.MONGOLAB_ROSE_URI || 'mongodb://localhost/fanco');

// var routes = require('./routes/index');
// var users = require('./routes/users'); ********** uncomment to add user registration

var app = express();

app.use(express.static('public'));
app.use(express.static('node_modules'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use('/', routes);
// app.use('/users', users); ********** uncomment to add user registration

app.get('/forecast', function(req, res){
	request('http://api.openweathermap.org/data/2.5/forecast/daily?q=Boston&APPID=eae18de7d92e5fa1893eeb187956805f&cnt=16', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    // console.log(body);
		// var myReadStream = fs.createReadStream((body.data), { encoding: 'utf8' });
		// var myWriteStream = fs.createWriteStream('data/forecast.json');
		// myReadStream.pipe(myWriteStream);

		// ***************CAUTION --- if u uncomment and run this, overwrites forecast.json file
		// fs.writeFile('data/forecast.json', body, 'utf8', function (err) {
	 //  		if (err) return console.log(err);
	 //  		// console.log();
		// });
	    res.send(body);
	  }
	});
});


app.get('/history', function(req, res){

	request('http://api.worldweatheronline.com/premium/v1/past-weather.ashx?q=Boston&format=json&date=2016-05-16&enddate=2016-05-30&key=22b79bd1845840e6a68110850171101&tp=24', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    console.log(body);

	    	// ***************CAUTION --- if u uncomment and run this, overwrites history.json file
			// fs.writeFile('data/history.json', body, 'utf8', function (err) {
		 //  	if (err) return console.log(err);
			// });

		  res.send(body);

		}
	});
});

var port = process.env.PORT || '7000';

app.listen(port, function () {
  console.log('ok! On: localhost:' + port);
});