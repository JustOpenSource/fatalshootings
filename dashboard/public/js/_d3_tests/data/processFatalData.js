define("data/processFatalData", 
	["underscore", 
	"data/fatalEncounters"], 
	function(_, fatalEncounters) {
	
	var entries = fatalEncounters.feed.entry;

	var dataKeys = ['subjectsname', 
		'subjectsage', 
		'subjectsgender', 
		'subjectsrace', 
		'urlofimageofdeceased', 
		'dateofinjuryresultingindeathmonthdayyear',
		'locationofinjuryaddress',
		'locationofdeathcity',
		'locationofdeathstate',
		'locationofdeathzipcode',
		'locationofdeathcounty',
		'agencyresponsiblefordeath',
		'causeofdeath',
		'abriefdescriptionofthecircumstancessurroundingthedeath',
		'officialdispositionofdeathjustifiedorother',
		'linktonewsarticleorphotoofofficialdocument',
		'symptomsofmentalillness',
		'uniqueidentifiersubmittedby',
		'datedescription',
		'_dmair']

	dataKeys = dataKeys.reverse();

	function splitContent(content){
		var contentObject = {},
			splitContent;

		_.each(dataKeys, function(dataKey){
			//split the content at the key
			splitContent = content.split(dataKey + ":");

			//set content to be what remains before the key
			content = splitContent[0];

			//trim last two characters (a comma followed by a space)
			splitContent = splitContent[1] ? splitContent[1].substring(0, splitContent[1].length - 2) : '';

			contentObject[dataKey] = splitContent;
		});

		return contentObject;
	}

	function processData(data){
		var adjustedEntries = [];
		_.each(data, function(entry){
			adjustedEntries.push(splitContent(entry.content.$t));
		});

		console.log(JSON.stringify(adjustedEntries));

		return adjustedEntries;
	}

	return processData(entries);
});