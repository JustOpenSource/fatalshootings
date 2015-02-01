define(["jquery", 
		"d3", 
		"utils/d3utils",
		"underscore", 
		"data/processFatalData",], 
		function($, d3, utils, _, fatalEncountersData) {
	
	//console.log('fatalEncountersData----');
	//console.log(fatalEncountersData);

	/*
	var recordElements = d3.selectAll("#recordContainer p")
		.data(fatalEncountersData)
		.enter().append("p")
    	.text(function(d) {
    		return ":" + d.subjectsgender;
    	});

   	var testSelect = d3.selectAll("#recordContainer p");
   	*/

   	/*
	var deathFrequencies = {};

	deathFrequencies.justification = utils.valueFrequency(fatalEncountersData, 'officialdispositionofdeathjustifiedorother');
	deathFrequencies.age = utils.valueFrequency(fatalEncountersData, 'subjectsage');
	deathFrequencies.gender = utils.valueFrequency(fatalEncountersData, 'subjectsgender');
	deathFrequencies.race = utils.valueFrequency(fatalEncountersData, 'subjectsrace');
	deathFrequencies.agency = utils.valueFrequency(fatalEncountersData, 'agencyresponsiblefordeath');
	deathFrequencies.cause = utils.valueFrequency(fatalEncountersData, 'causeofdeath');

	var graphFrequency = function(dataSets){
		var facetKeys = Object.keys(dataSets),
			sections= {};
		
		function createFrequencyGraphSection(selector, key){
			d3.select(selector).append('div').attr('class', 'frequencyWrapper').append('svg').attr('class', 'frequency-' + key);
			return 'svg.frequency-' + key;
		}

		function buildGraph(section){
			function keyFunction(item){
			    return item.values ? item.values : '';
			}

			var wrapper = d3.select(section.element);

			var elements = wrapper.selectAll('rect')
			    .data(section.data, keyFunction)
			    .enter()
			    .append('rect');

		    var heightOffset = 0,
		    	heightDistance = 20;


		    function returnMaxValue(data){
		    	var max = d3.max(data, function(d) {
		    		console.log('d');
		    		console.log(d);
		    		return + d.values;
		    	});
		    	console.log('max');
		    	console.log(max);
		    	return max;
		    }

		    var scaleFrequency = d3.scale.linear()
		    						.domain([0, returnMaxValue(section)])
		    						.range([0, 300]);

		    console.log('scaleFrequency');
		    console.log(scaleFrequency(300));

		    elements.attr('width', function(d){
		    		console.log(d);
		    		console.log(scaleFrequency[d.values]);
			        return scaleFrequency(d.values) + 'px';
			    })
		    	.attr('height', 10)
		    	.attr('x', 0)
		    	.attr('y', function(){
		    		heightOffset = heightOffset + heightDistance;
		    		return heightOffset
		    	});

		}

		facetKeys.forEach(function(key, i){
			var set = dataSets[key];

			sections[key] = {
				element : createFrequencyGraphSection('#recordContainer', key),
				data : dataSets[key]
			}
			
			buildGraph(sections[key]);
		});
	}

	graphFrequency(deathFrequencies);
	*/
});
