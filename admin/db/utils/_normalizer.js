
//start complex normalization functions
var clean = {section: {}, fields: { death: {}, event: {}, location: {}, subject: {} }, defaults: {} } ;
//each section function takes the corresponding section from the data object, so clean.section.death expects to be passed element.death
clean.section.death = function(section){
    var output = clean.defaults.death;
    if(typeof section !== 'undefined'){
        var c = clean.fields.death.cause(section.cause);
        output.cause = c.cause;
        output.cause_notes = c.cause_notes;
        output.responsible_agency = section.responsible_agency ? superTrim(section.responsible_agency) : output.responsible_agency;
        output.description = section.description ? superTrim(section.description) : output.description;
        output.dated_description = section.dated_description ? superTrim(section.dated_description) : output.dated_description;
        output.disposition = section.disposition? superTrim(section.disposition) : output.disposition;
        output.source_url = section.source_url ? superTrim(section.source_url) : output.source_url;
        output.event = clean.section.event(section.event);
    }
    return output;
}
clean.section.event = function(section){
    var output =  clean.defaults.event;
    if(typeof section !== 'undefined'){
        output.address = section.address ? superTrim(section.address) : output.address;
        output.date = section.date ? superTrim(section.date) : output.date;
    }
    return output;
}
clean.section.location = function(section){
    var output = clean.defaults.location;
    if(typeof section !== 'undefined'){
        output.city = section.city ? superTrim(section.city) : output.city;
        output.country = section.county ? superTrim(section.county) : output.county;
        output.state = section.state ? superTrim(section.state).toLowerCase() : output.state;
        output.zipcode = section.zipcode ? superTrim(section.zipcode) : output.zipcode;
    }
    return output;
}
clean.section.subject = function(section){
    var output = clean.defaults.subject;
    if(typeof section !== 'undefined'){
        output.age = section.age && isNumeric(superTrim(section.age)) ? superTrim(section.age) : 0;
        output.type = section.type ? clean.fields.subject.type(section.type) : output.type;
        output.name = section.name ? superTrim(section.name) : output.name;
        output.race = section.race ? superTrim(section.race) : output.race;
        output.image_url = section.image_url ? superTrim(section.image_url) : output.image_url;
        output.mental_illness = section.mental_illness ? superTrim(section.mental_illness) : output.mental_illness;
    }
    return output;
}
//each field function expects 
clean.fields.death.cause = function(cause){
    var output = { cause: '', cause_notes : ''};
    if(typeof cause !== 'undefined'){
        var c = superTrim(cause);
        c = c ? c.toLowerCase() : c;
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
    }
    return output;
}
clean.fields.subject.type = function(type){
    var types = ['male','female','intersex','unknown'];
    var output = 'unknown';
    //this isn't working
    var t = superTrim(type);
    if(types.indexOf(t) >= 0){
        output = t;
    }
    //console.log('trying to convert "'+type+'" my guess was "'+output+'" because I got "'+t+'"');
    return output;
}
clean.defaults.event = {
    address:                '',
    date:                   '',    
}
clean.defaults.death = {
    cause:                  '',
    cause_notes:            '',
    responsible_agency:     '',
    description:            '',
    dated_description:      '',
    disposition:            '',
    source_url:             '',
    event:                  clean.defaults.event,
}
clean.defaults.location = {
    city:                   '',
    county:                 '',
    state:                  '',
    zipcode:                '',
}
clean.defaults.subject = {
    age:                    0,
    type:                   'unknown',
    name:                   '',
    race:                   '',
    image_url:              '',
    mental_illness:         '',
}

function superTrim(string, tried){
    if(typeof tried === 'undefined'){
        tried = 0;
    }
    var output = '';
    if(string && typeof string !== "string" && tried === 0){
        output = superTrim(string.toString(),tried+1);
    }else if(typeof string !== "string" && tried > 0){
        output = "error";
    }else{
        output = string;
    }
    if(output){
        output = output.replace("\x1A","").trim();
    }
    return output;
}

function isNumeric(n){
    //from http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function cleanRow(row){
    var output = {};
    if(row && row.value){
        output.value = {};
        output.id = row.id;
        output.key = row.key;
        output.value.submitted_by = superTrim(row.value.submitted_by) || 'a'; 
        output.value.death = clean.section.death(row.value.death) || clean.defaults.death;
        output.value.location = clean.section.location(row.value.location) || clean.defaults.location;
        output.value.subject = clean.section.subject(row.value.subject) || clean.defaults.subject; 
        output.value.published = (row.value.published === true);
    }
    return output;
}

//start output
var normalizer = {
    cleanResults: function(body){
        //var output = body;
        var output = {};
        if(body.rows){
            //set output to match body and clear out existing rows
            var outputRows = [];

            var bodyRows = body.rows;
            
            //loop through body and update rows
            var len = bodyRows.length;
            for(var i = 0; i < len; i++){
                //Array.prototype.push.apply(output.rows, [normalizer.cleanRow(body.rows[i])] );
                //output.rows.push(normalizer.cleanRow(body.rows[i]));
                
                var data = cleanRow(bodyRows[i]);

                outputRows[i] = data;
                console.log(outputRows[i].value.subject.name);


            }
            output.rows = outputRows;

            var olen = output.rows.length;
            for(var x = 0; x < olen; x++){
                console.log('subject:',output.rows[x].value.subject.name + ' | ' +output.rows[x].key);
            }
            output.total_rows = i;
            output.offset = body.offset;
        }
        return output;
    }
}

module.exports = normalizer;