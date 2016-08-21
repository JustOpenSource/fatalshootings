
var page = require('webpage').create();
page.open('/Users/troy/dev/fatalshootings/chart-index.html', function() {
  page.render('charts-1.png');
  phantom.exit();
});