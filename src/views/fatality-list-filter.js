__base = __base || '../';
var c = require(__base + 'constants');
var log = require(__base + 'utils/log')('views/fatality-list-filter');
var httpGet = require(__base + 'utils/http-get');
var q = require('q');
var _ = require('underscore');
var feSchema = require(__base + 'schemas-cache/fe.1.json');
var getSchemaLang = require(__base + 'utils/schema-lang-get');

var RECORD_STATUS_ATTRIBUTES = ['new', 'pending', 'published'];
var ASSIGNEE_ATTRIBUTES = ['me', 'nobody'];

function buildOptions(name, attributes, d){

    //TODO: remove the need for these to be manually brought in, just choose the right options based on the name
    var personLangOptions = getSchemaLang('person', d._str._lang);
    var deathLangOptions = getSchemaLang('death', d._str._lang);
    var assigneeLangOptions = getSchemaLang('assignee', d._str._lang);
    var recordStateLangOptions = getSchemaLang('record_state', d._str._lang);

    var langOptions = {};
    var options = [];
    var optionDefault = d._str.select_label_prefix + ' ';

    //TODO: remove the need for the case if here, just select the right values based on the name
    if(name === 'sex'){

        langOptions = personLangOptions.sex;

        optionDefault = optionDefault + d._str.select_label_sex;

    } else if(name === 'race'){

        langOptions = personLangOptions.race;

        optionDefault = optionDefault + d._str.select_label_race;

    } else if(name === 'cause'){

        langOptions = deathLangOptions.cause;

        optionDefault = optionDefault + d._str.select_label_cause;
    
    } else if(name === 'record_state'){

        langOptions = recordStateLangOptions;

        optionDefault = d._str.select_record_status;

    } else if(name === 'assignee'){
        
        langOptions = assigneeLangOptions;

        optionDefault = d._str.select_assignee;

    }

    options.push({
        value: null,
        selected: false,
        text: optionDefault
    })

    _.each(attributes, function(value, i){

        if(value) {
            options.push({
                value: value.trim(),
                selected: d.filters[name] === value.trim() ? 'selected' : false,
                text: langOptions[value]
            })
        }
    });

    return options;
}

module.exports = function(d, cb) {

    function fetchAllComplete(){

        log('trace', 'feSchema 1', feSchema.properties.person);

        var filterModel = {
            userFilter: [],
            publicFilter: []
        };

        filterModel.userFilter.push({
            name: 'record_state',
            options: buildOptions('record_state', RECORD_STATUS_ATTRIBUTES, d)
        });

        filterModel.userFilter.push({
            name: 'assignee',
            options: buildOptions('assignee', ASSIGNEE_ATTRIBUTES, d)
        });

        filterModel.publicFilter.push({
            name: 'sex',
            options: buildOptions('sex', feSchema.properties.person.type.schema.properties.sex.enum, d)
        });

        filterModel.publicFilter.push({
            name: 'race',
            options: buildOptions('race', feSchema.properties.person.type.schema.properties.race.items.enum, d)
        });

        filterModel.publicFilter.push({
            name: 'cause',
            options: buildOptions('cause', feSchema.properties.death.type.schema.properties.cause.enum, d)
        });

        filterModel.name = d.filters.name || null;

        filterModel.postURL = d.url_current;

        filterModel.user = d._user;

        cb(null, filterModel);
    }

    fetchAllComplete();
};
