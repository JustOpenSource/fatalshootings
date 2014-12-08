define(["jquery"], function($) {
	$.getJSON('http://cors.io/spreadsheets.google.com/feeds/list/0Aul9Ys3cd80fdHNuRG5VeWpfbnU4eVdIWTU3Q0xwSEE/od6/public/values?alt=json', function(json) {
  		console.log('test');
  		console.log(json);
	});

	$.getJSON("https://spreadsheets.google.com/feeds/list/0AtMEoZDi5-pedElCS1lrVnp0Yk1vbFdPaUlOc3F3a2c/od6/public/values?alt=json", function(data) {
  //first row "title" column
  console.log(data.feed.entry[0]['gsx$title']['$t']);
});
});