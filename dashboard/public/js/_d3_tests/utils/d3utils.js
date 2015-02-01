define('utils/d3utils', ['d3'], function(d3) {
	var d3utils = {},
		t = d3utils;

	t.valueFrequency = function(data, key, sort){
   		function returnDyanamicKey(propertyName){
	  		return function(d){ 
	            return d[propertyName];
	        };
		}

   		var dataSet = d3.nest()
			.key(returnDyanamicKey(key))
			.rollup(function(d){
				return d.length;
			}).entries(data)

		return dataSet.sort(function(a, b){
			if(sort == 'ascending'){
				return a.values - b.values;
			} else {
				return b.values - a.values
			}
		})
   	}

	return d3utils;
});