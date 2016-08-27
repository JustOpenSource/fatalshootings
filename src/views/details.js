__base = __base || '../';
var c = require(__base + 'constants');
var log = require(__base + 'utils/log')('views/details');
var _ = require('underscore');
var httpGet = require(__base + 'utils/http-get');
var feSchema = require(__base + 'schemas/fe.1.json');
var getSchemaLang = require(__base + 'utils/schema-lang-get');

/**
 * details view model
 * 
 * @param {string} d.id - ID of the entry.
 * @param {boolean} d.edit - Is the form in edit mode.
 * @param {boolean} d.success - Did the form successfully post.
 * @param {object} d.missing_values - Where there missing values.
 * @param {object} d.details - Details already filled in by user.
 */

//TODO: add schema to models and adjust renderView to validate against schema
/*
function main({
        "id" : {
            "type": "string"
        }

    }, d, cb) {
*/

function main(d, cb) {

    personLangOptions = getSchemaLang('person', d._str._lang);
    deathLangOptions = getSchemaLang('death', d._str._lang);
    locationLangOptions = getSchemaLang('location', d._str._lang);
    ageLangDefaultOption = d._str.section.person.age.option_default;

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
            'missing' : d.missing,
            'controls' : generateControls(d, {
                edit: true,
                isNew: true
            }),
            'submit' : generateSubmit(d, {
                edit: true,
                isNew: true
            }),
            'id' : d.id,
            'sections' : formatDetails(details, d._str, d._user),
            'success' : d.success,
            'action' : '/details/new'
        });

    } else {

        httpGet(d.locals.url_details + d.id, function(err, body){
            if(err){
                log('error', 'get details error', err);
                cb(err)
            }

            //is not a new record
            //body.isNew = false;

            if(d.edit){
                body.edit = true;
            }

            cb(null, {
                'edit' : d.edit,
                'id' : d.id,
                'controls' : generateControls(d, body),
                'submit' : generateSubmit(d, body),
                'sections' : formatDetails(body, d._str, d._user),
                'action' : '/details/' + d.id + '?edit=true'
            });
        });
    }
}

/*
TODO: Wire up form elements to use select options for appropriate fields
*/

var personLangOptions;
var deathLangOptions;
var locationLangOptions;
var ageLangDefaultOption;

function generateOptions(options, lang, selected){
    var optionsObj = [];

    _.each(options, function(curr){
        optionsObj.push({
            'selected' : selected == curr ? true : false,
            'value' : curr,
            'text' : lang[curr]
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
        'text' : ageLangDefaultOption
    });

    return ages;
}

function sexOptions(selected){

    return generateOptions(feSchema.properties.person.type.schema.properties.sex.enum, personLangOptions.sex, selected);
}

function orientationOptions(selected){

    return generateOptions(feSchema.properties.person.type.schema.properties.orientation.enum, personLangOptions.orientation, selected);
}

function raceOptions(selected){

    return generateOptions(feSchema.properties.person.type.schema.properties.race.items.enum, personLangOptions.race, selected);
}

function causeOfDeathOptions(selected){

    return generateOptions(feSchema.properties.death.type.schema.properties.cause.enum, deathLangOptions.cause, selected);
}

function dispositionOptions(selected){

    return generateOptions(feSchema.properties.death.type.schema.properties.disposition.enum, deathLangOptions.disposition, selected);
}

function countryOptions(selected){

    return generateOptions(feSchema.properties.location.type.schema.properties.country.enum, locationLangOptions.country, selected);
}

function formatDetails(details, str, user){

    log('trace', 'details.value!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', details);

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

    function isRequired(){
        return user.username ? false : true;
    }

    if(!details){
        var details = {
            'value' : {
                'subject' : {},
                'location' : {},
                'death' : {
                    event: {}
                }
            }
        }
    }

  	var subject = [
  		{
        'label' : str.section.person.name.label,
        'value' : details.value.person_name,
        'name' : 'subject_name',
        'input-text' : true,
        'required' : isRequired()
      },
      {
        'label' : str.section.person.age.label, 
        'value' : details.value.person_age, 
        'name' : 'subject_age',
        'input-select' : true,
        'options' : ageOptions
      },
      {
        'label' : str.section.person.sex.label, 
        'value' : details.value.person_gender, 
        'name' : 'subject_sex',
        'input-select' : true,
        'options' : sexOptions
      },
      {
        'label' : str.section.person.orientation.label, 
        'value' : details.value.person_orientation, 
        'name' : 'subject_orientation',
        'input-select' : true,
        'options' : orientationOptions
      },
      {
        'label' : str.section.person.mental_illness.label, 
        'value' : details.value.person_mentalillness, 
        'name' : 'subject_orientation',
        'input-select' : true,
        'options' : orientationOptions
      },
      {
        'label' : str.section.person.transgender.label,
        'value' : details.value.person_trans || false,
        'name' : 'subject_transgender',
        'input-checkbox' : true
      },
      {
        'label' : str.section.person.race.label, 
        'value' : details.value.person_race, 
        'name' : 'subject_race',
        'input-select' : true,
        'options' : raceOptions
      }
  	];

    var death = [
      {
        'label' : str.section.death.date.label, 
        'value' : details.value.death_date, 
        'name' : 'death_date',
        'input-date' : true,
        'required' : isRequired()
      },
      {
        'label' : str.section.death.cause.label, 
        'value' : details.value.death_cause, 
        'name' : 'death_cause',
        'input-select' : true,
        'options' : causeOfDeathOptions
      },
      {
        'label' : str.section.death.responsible_agency.label,
        'value' : details.value.death_agency, 
        'name' : 'death_responsible_agency',
        'input-text' : true
      },
      {
        'label' : str.section.death.description.label,
        'value' : details.value.death_description, 
        'name' : 'death_description',
        'input-textarea' : true
      },
      {
        'label' : str.section.death.disposition.label,
        'value' : details.value.death_disposition, 
        'name' : 'death_disposition',
        'input-select' : true,
        'options' : dispositionOptions
      }
    ];

    var location = [
      {
        'label' : str.section.location.country.label,
        'value' : details.value.death_location_country || 'us', 
        'name' : 'location_country',
        'input-select' : true,
        'options' : countryOptions,
        'required' : isRequired()
      },
      {
        'label' : str.section.location.city.label,
        'value' : details.value.death_location_city, 
        'name' : 'location_city',
        'input-text' : true
      },
      {
        'label' : str.section.location.state.label,
        'value' : details.value.death_location_state, 
        'name' : 'location_state',
        'input-text' : true,
        'required' : isRequired()
      },
      {
        'label' : str.section.location.postal.label,
        'value' : details.value.death_location_zip, 
        'name' : 'location_zip',
        'input-text' : true
      }
    ];

    var sources = [
      {
        'label' : str.section.additional_info.sources.label,
        'value' : details.value.sources, 
        'name' : 'sources',
        'input-textarea' : true,
        'notes' : str.section.additional_info.sources.notes,
        'required' : isRequired()
      }
    ];

    if(details.edit && str.section.additional_info){
        sources.push({
            'label' : str.section.additional_info.edit_notes.label,
            'value' : details.value.edit_notes, 
            'name' : 'edit_notes',
            'input-textarea' : true,
            'notes' : str.section.additional_info.edit_notes.notes
        });
    }

    var sections = [{
  		'sectionTitle' : str.section.person.title,
  		'values' :  processSectionInputs(subject)
  	}, {
        'sectionTitle' : str.section.death.title,
        'values' :  processSectionInputs(death)
    }, {
        'sectionTitle' : str.section.location.title,
        'values' :  processSectionInputs(location)
    }, {
        'sectionTitle' : str.section.additional_info.title,
        'values' :  processSectionInputs(sources)
    }];

    return sections;
}

function generateControls(d, body){

    body = body ? body : {};

    return d.renderView('details-controls', {
        "id": d.id,
        "edit": body.edit,
        //"new" : body.isNew,
        "user" : d._user,
        //"state" : body.record_state,
        //"assignee" : body.assignee,
        "suggestEdits" : body.edit
    });
}

function generateSubmit(d, body){

    body = body ? body : {};

    var submit = d.renderView('details-submit', {
        "id": d.id,
        "edit": body.edit,
        //"new" : body.isNew,
        "user" : d._user,
        //"state" : body.record_state,
        //"assignee" : body.assignee
    });

    return submit;
}

module.exports = main;