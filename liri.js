// variable to grab the exported keys.
var myKeys = require("./keys.js");

var firstArgument = process.argv[2];
var userQuery = process.argv[3];
logCommandLine();

if (firstArgument === "my-tweets"){
	myTweets();
}
else if (firstArgument === "movie-this"){
	if (userQuery === undefined || userQuery===""){
		userQuery = 'Mr. Nobody.';
	}
	omdbMovies(userQuery);
}
else if (firstArgument === "spotify-this-song"){
	if (userQuery === undefined || userQuery === ""){
		userQuery = 'The Sign';
	}
	spotifyThisSong(userQuery);
	
}
else if (firstArgument === "do-what-it-says"){
	randomSong();
}
else {
	console.log("Not a defined choice");
}

//MyTweets function accessing Twitter to display the details.
function myTweets(){

	var Twitter = require('twitter');
	var client = new Twitter({
		consumer_key: myKeys.twitterKeys.consumer_key,
		consumer_secret:myKeys.twitterKeys.consumer_secret,
		access_token_key:myKeys.twitterKeys.access_token_key,
		access_token_secret:myKeys.twitterKeys.access_token_secret 
	})
	// console.log(client)
	var params = {csri356: 'nodejs'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  res = JSON.stringify(tweets, null, 2)
	  if (!error) {
	    // console.log("in Tweets function" + res);
	    var fs = require('fs');
	    for (var key in tweets){
	    	console.log(tweets[key].text);
	    	console.log(tweets[key].created_at);
	    	var logResult = "Tweet Text: " + tweets[key].text + "\n" +
	        				"Created At: " + tweets[key].created_at + "\n" +
	        				"======================Results================================" + "\n"
    		fs.appendFile("log.txt", logResult, function (err){
				if (err){
					return console.log(err);
				}

			});	
	    }
	    
	  }

	});
}
function omdbMovies(userQuery){
	var request = require("request");

	// Grab or assemble the movie name and store it in a variable called "movieName"
	var movieName = "";
	// ...
	movieName = userQuery;

	// Then run a request to the OMDB API with the movie specified
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

	// Then create a request to the queryUrl
	request(queryUrl,function(err,response){
		response.body = JSON.parse(response.body);
		console.log(" ");
		console.log("Title: " + response.body.Title);
		console.log("Released Year: " + response.body.Year);
		console.log("IMDB Rating: " + response.body.imdbRating);
		// console.log(response.body.Ratings)
		var rottenTomatoRatings = '';
		for (var key in response.body.Ratings){
			if (response.body.Ratings[key].Source === "Rotten Tomatoes") {
				console.log("Rotten Tomatoes Rating: " + response.body.Ratings[1].Value);
				rottenTomatoRatings = response.body.Ratings[1].Value;
			}
		}
		console.log("Country: " + response.body.Country);
		console.log("Language: " + response.body.Language);
		console.log("Plot: " + response.body.Plot);
		console.log("Actors: " + response.body.Actors);
		console.log(" ");

		var logResult = "Title: " + response.body.Title + "\n" +
						"Released Year: " + response.body.Year + "\n" +
						"IMDB Rating: " + response.body.imdbRating + "\n" +
						"Rotten Tomatoes Rating: " + rottenTomatoRatings + "\n" +
						"Country: " + response.body.Country + "\n" +
						"Language: " + response.body.Language + "\n" +
						"Plot: " + response.body.Plot + "\n" +
						"Actors: " + response.body.Actors + "\n" +
						"======================Results================================" + "\n"
		var fs = require('fs');
		fs.appendFile("log.txt", logResult, function (err){
			if (err){
				return console.log(err);
			}
		});	
	})
}

function spotifyThisSong(songName){

	var Spotify = require('node-spotify-api');
	var spotify = new Spotify({
	  id: myKeys.spotifyKeys.consumer_key,
	  secret: myKeys.spotifyKeys.consumer_secret
	});
	
 	var limit =10;
 	var queryUrl = "https://api.spotify.com/v1/search?q=" + songName + "&limit=" + limit + "&type=track,album&-H&Accept: application/json"

	spotify.request(queryUrl)
  	   .then(function(data) {
  	   		// console.log(data.tracks.items.length)
  	   		if (data.tracks.items.length != 0){
  	   			var fs = require('fs');
	        	for (var i=0; i<limit; i++){
		     		console.log(' ');
					console.log("Artists: " + data.tracks.items[i].artists[0].name);
					console.log("Song Name: " + data.tracks.items[i].name);
					console.log("Preview URL: " + data.tracks.items[i].preview_url);
					console.log("href: " + data.tracks.items[i].album.href);
					console.log("Song Album: " + data.tracks.items[i].album.name);
					console.log(' ');
					var logResult =  + "\n" + 
								"Artists: " + data.tracks.items[i].artists[0].name + "\n" +
	        					"Song Name: " + data.tracks.items[i].name + "\n" +
	        					"Preview URL: " + data.tracks.items[i].preview_url + "\n" +
	        					"href: " + data.tracks.items[i].album.href + "\n" +
	        					"Song Album: " + data.tracks.items[i].album.name + "\n" +
	        					"======================Results================================" + "\n"
	        		fs.appendFile("log.txt", logResult, function (err){
						if (err){
							return console.log(err);
						}
						

					});	
	        	}
	        						
	        	//copy the contents into the log file.
	        	

        	}else {
        		console.log(" your song does not exist, please change the song phrase and try again")
        	}
  		})
		.catch(function(err) {
    	console.error('Error occurred: ' + err); 
  	});
}

function randomSong(){
	var fs = require('fs');
	fs.readFile("random.txt", "utf8", function (err, data){
		if (err){
			return console.log(err);
		}

		var output = data.split(',');
		var songName = (output[1]);
		spotifyThisSong(songName);
	});

}
function logCommandLine(){
	var fs = require('fs');
	if (userQuery === undefined || userQuery === ""){
		userQuery= "";
	}
	var commandExecuted = "-----------------------------Command------------------------------" + "\n" + "node liri.js " + '"' + firstArgument + '"' + " " + '"' + userQuery + '"' + '\n' +"-----------------------------Command------------------------------" + "\n";
	fs.appendFile("log.txt", commandExecuted, function (err){
		if (err){
			return console.log(err);
		}
		// console.log("Command Line Arguments Logged in Log.txt file")

	});	
}


