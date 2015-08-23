var __base = __base || '../',
    c = require(__base + 'shared-config/constants'),
    log = c.getLog('shared-views/details'),
    _ = require('underscore'),

    httpGet = require(__base + 'shared-utils/http-get'),
    feSchema = require(__base + 'shared-utils/schemas-cache/fe.1.json');

/*
TODO: Wire up form elements to use select options for appropriate fields
*/

console.log(JSON.stringify(feSchema));

function getDetails(id, url, cb) {

    log('trace', 'attempt to get details: ' + id);

    /**/
    httpGet(url + id, cb);
	/**/
}

function generateOptions(options, selected){
    var optionsObj = [];

    _.each(options, function(curr){
        optionsObj.push({
            'selected' : selected == curr ? true : false,
            'value' : curr,
            'text' : curr
        });
    });

    return optionsObj;
}

/*
TODO: Generate option values from schema
*/
function ageOptions(selected){
    var ages = [],
        upperLimit = feSchema.properties.person.type.schema.properties.age.maximum,
        curr = 1;

    selected = parseInt(selected);

    while(curr <= upperLimit){
        
        ages.push({
            'selected' : selected === curr ? true : false,
            'value' : curr,
            'text' : curr
        });

        curr++;
    }

    ages.unshift({
            'selected' : !selected ? true : false,
            'value' : 'Unknown',
            'text' : 'Unknown'
        })

    return ages;
}

function sexOptions(selected){

    return generateOptions(feSchema.properties.person.type.schema.properties.sex.enum, selected);
}

function orientationOptions(selected){

    return generateOptions(feSchema.properties.person.type.schema.properties.orientation.enum, selected);
}

//TODO: adjust this to be checkboxes
function raceOptions(selected){

    return generateOptions(feSchema.properties.person.type.schema.properties.race.items.enum, selected);
}

//TODO: adjust this to be checkboxes
function mentalIllnessOptions(selected){

    return generateOptions(feSchema.properties.person.type.schema.properties.mental_illness.items.enum, selected);
}

function causeOfDeathOptions(selected){

    return generateOptions(feSchema.properties.death.type.schema.properties.cause.enum, selected);
}

function dispositionOptions(selected){

    return generateOptions(feSchema.properties.death.type.schema.properties.disposition.enum, selected);
}

function countryOptions(selected){

    return generateOptions(feSchema.properties.location.type.schema.properties.country.enum, selected);
}

function formatDetails(details){

    function processSectionInputs(section){

      _.each(section, function(input, i){

        input.status = {};

        if(details.missing_values && details.missing_values.indexOf(input.name) > -1){
          input.status.missing = true;
        }

        if(details.edit){
          input.required = false;
        }

        if(input.required){
          input.status.required = true;
        }

        if(typeof input.options === 'function'){
          
          input.options = input.options(input.value);
        }
      });

      return section;
    }

    if(!details){
      var details = {
        'value' : {
          'subject' : {},
          'death' : {
            event: {}
          },
          'location' : {}
        }
      }
    }

  	var subject = [
  		{
        'label' : 'Name', 
        'value' : details.value.subject.name, 
        'name' : 'subject_name',
        'input-text' : true,
        'required' : true
      },
      {
        'label' : 'Age', 
        'value' : details.value.subject.age, 
        'name' : 'subject_age',
        'input-select' : true,
        'options' : ageOptions
      },
      {
        'label' : 'Sex', 
        'value' : details.value.subject.sex, 
        'name' : 'subject_sex',
        'input-select' : true,
        'options' : sexOptions
      },
      {
        'label' : 'Orientation', 
        'value' : details.value.subject.orientation, 
        'name' : 'subject_orientation',
        'input-select' : true,
        'options' : orientationOptions
      },
      {
        'label' : 'Transgender',
        'value' : details.value.subject.transgender,
        'name' : 'subject_transgender',
        'input-checkbox' : true
      },
      {
        'label' : 'Race', 
        'value' : details.value.subject.race, 
        'name' : 'subject_race',
        'input-select' : true,
        'options' : raceOptions
      },
      {
        'label' : 'Mentall Illness', 
        'value' : details.value.subject.mental_illness, 
        'name' : 'subject_mental_illness',
        'input-select' : true,
        'options' : mentalIllnessOptions
      }
  	];

    var death = [
      {
        'label' : 'Date', 
        'value' : details.value.death.date, 
        'name' : 'death_date',
        'input-date' : true,
        'required' : true
      },
      {
        'label' : 'cause', 
        'value' : details.value.death.cause, 
        'name' : 'death_cause',
        'input-select' : true,
        'options' : causeOfDeathOptions
      },
      {
        'label' : 'Cause Notes', 
        'value' : details.value.death.notes, 
        'name' : 'death_cause_notes',
        'input-textarea' : true
      },
      {
        'label' : 'Responsible Agency', 
        'value' : details.value.death.responsible_agency, 
        'name' : 'death_responsible_agency',
        'input-text' : true
      },
      {
        'label' : 'Description', 
        'value' : details.value.death.description, 
        'name' : 'death_description',
        'input-textarea' : true
      },
      {
        'label' : 'Disposition', 
        'value' : details.value.death.disposition, 
        'name' : 'death_disposition',
        'input-select' : true,
        'options' : dispositionOptions
      }
    ];

    var location = [
      {
        'label' : 'Address Line 1', 
        'value' : details.value.location.address_line_1, 
        'name' : 'location_address_line_1',
        'input-text' : true,
        'options' : countryOptions
      },
      {
        'label' : 'Address Line 2', 
        'value' : details.value.location.address_line_2,
        'name' : 'location_address_line_2',
        'input-text' : true,
        'options' : countryOptions
      },
      {
        'label' : 'Country', 
        'value' : details.value.location.country || 'us', 
        'name' : 'location_country',
        'input-select' : true,
        'options' : countryOptions,
        'required' : true
      },
      {
        'label' : 'City', 
        'value' : details.value.location.city, 
        'name' : 'location_city',
        'input-text' : true
      },
      {
        'label' : 'State', 
        'value' : details.value.location.state, 
        'name' : 'location_state',
        'input-text' : true,
        'required' : true
      },
      {
        'label' : 'County', 
        'value' : details.value.location.county, 
        'name' : 'location_county',
        'input-text' : true
      },
      {
        'label' : 'Postal Code', 
        'value' : details.value.location.zip, 
        'name' : 'location_zip',
        'input-text' : true
      }
    ];

    var sources = [
      {
        'label' : 'Sources',
        'value' : details.value.sources, 
        'name' : 'sources',
        'input-textarea' : true,
        'notes' : 'Use "enter" key to make a new line for each source.',
        'required' : true
      }
    ];

    if(details.edit){
      sources.push({
        'label' : 'Edit Notes',
        'value' : details.value.edit_notes, 
        'name' : 'edit_notes',
        'input-textarea' : true,
        'notes' : 'Please include any comments about your edits.'
      });
    }

    var sections = [{
  		'sectionTitle' : 'Subject',
  		'values' :  processSectionInputs(subject)
  	}, {
      'sectionTitle' : 'Death',
      'values' :  processSectionInputs(death)
    }, {
      'sectionTitle' : 'Location',
      'values' :  processSectionInputs(location)
    }, {
      'sectionTitle' : 'Additional Info',
      'values' :  processSectionInputs(sources)
    }];

    return sections;
}

module.exports = function(d, cb) {

  if(d.id === 'new'){

    var details = null;

    if(d.missing){
      details = {
        value : d.details,
        missing_values : d.missing_values
      }
    }

    cb(null, {
      'edit' : true,
      'new' : true,
      'id' : d.id,
      'sections' : formatDetails(details),
      'success' : d.success,
      'action' : '/details/new'
    });

  } else {

  	getDetails(d.id, d.locals.url_details, function(err, body){
  		if(err){
  			log('error', 'get details error', err);

  			//cb(err)
  		}

  		log('trace', 'get details', body);

      if(d.edit){
        body.edit = true;
      }

  		cb(null, {
        'edit' : d.edit || false,
  			'id' : d.id,
  			'sections' : formatDetails(body),
        'action' : '/details/' + d.id + '?edit=true'
  		});
  	});
  }
}