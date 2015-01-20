var _ = require('underscore'),
	cleanSection = {};

//DEATH
cleanSection.death = function(section){
	var c = cleanSection.cause(section["cause"]);

	return {
		"cause": c.cause,
		"cause_notes": c.cause_notes,
		"responsible_agency": superTrim(section["responsible_agency"]),
		"description": superTrim(section["description"]),
		"dated_description": superTrim(section["dated_description"]),
		"disposition": superTrim(section["disposition"]),
		"source_url": superTrim(section["source_url"]),
		"event": cleanSection.event(section["event"])
	}
}

cleanSection.event = function(section){
    return  {
	    "address": superTrim(section["address"]),
	    "date": superTrim(section["date"])
	}
}

cleanSection.cause = function(cause){
    var output = { cause: '', cause_notes : ''};

    if(typeof cause === 'undefined'){
    	return output;
    }
    
    var c = superTrim(cause),
    	c = c ? c.toLowerCase() : null;

    switch(c){
        //asphyxiation
        case 'asphyxiated, due in part to pcp intoxication':
        case 'smoke inhilation':
            output.cause_notes = c;
        case 'asphyxia':
        case 'asphyxiation':
        case 'asphyxiated':
            output.cause = 'asphyxiation';
        break;

        //assault
        case 'domestic abuse':
        case 'baton blows':
        case 'beaten with instruments':
        case 'bludgeoned with instrument':
        case 'stabbed':
        case 'stabbed/taser':
        case 'weapon':
        case 'beaten, asphyxiated, pepper sprayed':
            output.cause_notes = c;
        case 'battered':
        case 'beaten':
        case 'beaten to death':
        case 'beating':
        case 'physical beating':
            output.cause = 'assault';
        break;

        //gunshot
        case 'gunshot (with death by smoke inhalation)':
        case 'gunshot, pepper spray gun':
        case 'gunshot, tasered, beaten, bean bag rounds':
            output.cause_notes = c;
        case 'shooting':
        case 'gunhsot':
        case 'gunshot':
        case 'gunshots':
        case 'gushot':
            output.cause = 'gunshot';
        break;

        //unknown
        case 'undisclosed':
        case 'under investigation':
        case 'unknown medical issues':
            output.cause_notes = c;
        case 'unknown':
            output.cause = 'unknown';
        break;

        //suicide
        case 'lept of a building/suicide':
        case 'death inproximity (\"suicide\")':
        case 'suicide/leapt off building':
            output.cause_notes = c;
        case 'suicide':
            output.cause = 'suicide';
        break;

        //non-lethal weapon
        case 'bean bag rounds':
        case 'bean bag, taser':
        case 'pepper spray':
        case 'taser':
        case 'taser and pepper sprayed':
        case 'taser with drugs':
        case 'taser/illegal restraints':
        case 'tasered':
            output.cause = 'non-lethal weapon';
            output.cause_notes = c;
        break;

        //drug related
        case 'cocaine and ethanol intoxication, in combination with the fight':
        case 'drug overdose':
        case 'methamphetamine overdose':
            output.cause = 'drug related';
            output.cause_notes = c;
        break;

        //automobile
        case 'ran over by police car':
        case 'paddy wagon':
            output.cause_notes = c;
        case 'vehicle':
        case 'vehicle crash':
            output.cause = 'automobile'
        break;

        //neglect
        case 'negligence, failure to call paramedics when subject could not breathe due to asthma':
            output.cause_notes = c;
        case 'neglect':
            output.cause = 'neglect';
        break;

        //medical emergency
        case 'medical emergency, \"excited delirium with methamphetamine intoxication which led to cardiac arrest, all exacerbated by a pre-existing heart condition.\"':
        case 'medical emergency, asphyxiated':
        case 'pulmonary arrest':
            output.cause_notes = c;
        case 'medical emergency':
            output.cause = 'medical emergency';
        break;

        //other
        case 'crushed by trash compactor':
        case 'drowned':
        case 'explosion':
        case 'fall to death':
        case 'fell from a height':
        case 'fire':
            output.cause_notes = c;
            output.cause = 'other';
        break;

        //if I missed one here
        default:
            output.cause = 'error';
            output.cause_notes = c;
        break;
    }

    return output;
}

//SUBJEcT
cleanSection.subject = function(section){
    return {
    	"age" : superTrim(section["age"]),
    	"sex" : cleanSection.sex(section["type"]),
    	"name" : superTrim(section["name"]),
    	"race" : cleanSection.race(section["race"]),
    	"image_url" : superTrim(section["image_url"]),
    	"mental_illness" : superTrim(section["mental_illness"]),
    }
}

cleanSection.race = function(race){
    return (typeof race !== 'undefined') ? race : 'unknown' ;
}


cleanSection.sex = function(sex){
    var types = ['male','female','intersex','unknown'],
    	cleanedSex = 'unknown',
    	t = superTrim(sex),
    	t = t ? t.toLowerCase() : null;

    if(types.indexOf(t) != -1){
        cleanedSex = t;
    }

    return cleanedSex;
}

//LOCATION
cleanSection.state = function(state){
    var c = require('../../config/constants');
    var output = 'unknown';
    var s = superTrim(state);
    if(s === 'Washington'){
        output = 'WA';
    }else if(s){
        s = s.toUpperCase();
        if(typeof c.usStates.array[s] !== 'undefined'){
            output = s;
        }
    }
    return output;
}
cleanSection.location = function(location){
    return {
    	"city" : superTrim(location["city"]),
    	"county" : superTrim(location["county"]),
    	"state" : cleanSection.state(location["state"]),
    	"zipcode" : superTrim(location["zipcode"])
    }
}


//super trim
function superTrim(string, tried){
	tried = tried || 0;
    
    var output = '';

    if (string && typeof string !== "string" && tried === 0) {

        output = superTrim(string.toString(), tried + 1);
    
    } else if (typeof string !== "string" && tried > 0) {
        
        output = "error";
    
    } else {
    
        output = string;
    }
    
    if(output){
        output = output.replace("\x1A","").trim();
    }
    
    return output;
}

function cleanValue(rowValue){
	var cleanedRowValue = {};

	cleanedRowValue.death = cleanSection.death(rowValue.death);
	cleanedRowValue.subject = cleanSection.subject(rowValue.subject);
	cleanedRowValue.location = cleanSection.location(rowValue.location);
	cleanedRowValue.submitted_by = superTrim(rowValue.submitted_by);
	cleanedRowValue.published = (rowValue.published === true);

	return cleanedRowValue;
}

var normalizer = {
	cleanResults : function(d){
		console.log();
		var cleanedData = {},
			cleanedRows = [],
			uncleanedRows = d.rows;

		_.each(uncleanedRows, function(uncleanedRow, i){
			uncleanedRow.value = cleanValue(uncleanedRow.value);
			cleanedRows.push(uncleanedRow)
		});

		cleanedData.rows = cleanedRows;
		cleanedData.total_rows = cleanedRows.length;
		cleanedData.offset = d.offset;

		return cleanedData;
	}
}

module.exports = normalizer;