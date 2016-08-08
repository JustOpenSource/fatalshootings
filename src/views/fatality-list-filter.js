__base = __base || '../';
var c = require(__base + 'constants');
var log = require(__base + 'utils/log')('views/fatality-list-filter');
var httpGet = require(__base + 'utils/http-get');
var q = require('q');
var _ = require('underscore');
var feSchema = require(__base + 'schemas-cache/fe.1.json');
var getSchemaLang = require(__base + 'utils/schema-lang-get');

var RECORD_STATUS_ATTRIBUTES = ['suggestions', 'new', 'pending', 'published'];
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
    
    } else if(name === 'age_from'){

        langOptions = {'0':'0', '10':'10', '20':'20', '30':'30', '40':'40', '50':'50', '60':'60', '70':'70', '80':'80', '90':'90'};

        optionDefault = 'Age From';
    
    } else if(name === 'age_to'){

        langOptions = {'0':'0', '10':'10', '20':'20', '30':'30', '40':'40', '50':'50', '60':'60', '70':'70', '80':'80', '90':'90'};

        optionDefault = 'Age To';
    
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

        if(name === 'age_from'){
            console.log(d.filters);
            console.log(d.filters[name]);
            console.log(value);
            console.log(d.filters[name] === value.trim());
        }

        if(value.length) {
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

        console.log(feSchema.properties.person.type.schema.properties.sex.enum);

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
            name: 'age_from',
            options: buildOptions('age_from', ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90'], d)
        });

        filterModel.publicFilter.push({
            name: 'age_to',
            options: buildOptions('age_to', ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90'], d)
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

        filterModel.limit = d.filters.limit;

        filterModel.user = d._user;

        cb(null, filterModel);
    }

    fetchAllComplete();
};
