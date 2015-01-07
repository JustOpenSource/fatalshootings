requirejs.config({
    "baseUrl": "js",
    "paths": {
      "app": "/app",
      "d3": "//cdnjs.cloudflare.com/ajax/libs/d3/3.4.13/d3",
      "jquery": "//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery",
      "underscore": "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min",
      "backbone": "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min",
      "data/fatalEncounters" : "app/data/fatalEncounters20141207",
      "data/processFatalData" : "app/data/processFatalData",
       "utils/d3utils" : "app/utils/d3utils"
    }
});

requirejs(["main"]);