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

var states = [
    {
        "name": "Alabama",
        "abbreviation": "AL"
    },
    {
        "name": "Alaska",
        "abbreviation": "AK"
    },
    {
        "name": "American Samoa",
        "abbreviation": "AS"
    },
    {
        "name": "Arizona",
        "abbreviation": "AZ"
    },
    {
        "name": "Arkansas",
        "abbreviation": "AR"
    },
    {
        "name": "California",
        "abbreviation": "CA"
    },
    {
        "name": "Colorado",
        "abbreviation": "CO"
    },
    {
        "name": "Connecticut",
        "abbreviation": "CT"
    },
    {
        "name": "Delaware",
        "abbreviation": "DE"
    },
    {
        "name": "District Of Columbia",
        "abbreviation": "DC"
    },
    {
        "name": "Federated States Of Micronesia",
        "abbreviation": "FM"
    },
    {
        "name": "Florida",
        "abbreviation": "FL"
    },
    {
        "name": "Georgia",
        "abbreviation": "GA"
    },
    {
        "name": "Guam",
        "abbreviation": "GU"
    },
    {
        "name": "Hawaii",
        "abbreviation": "HI"
    },
    {
        "name": "Idaho",
        "abbreviation": "ID"
    },
    {
        "name": "Illinois",
        "abbreviation": "IL"
    },
    {
        "name": "Indiana",
        "abbreviation": "IN"
    },
    {
        "name": "Iowa",
        "abbreviation": "IA"
    },
    {
        "name": "Kansas",
        "abbreviation": "KS"
    },
    {
        "name": "Kentucky",
        "abbreviation": "KY"
    },
    {
        "name": "Louisiana",
        "abbreviation": "LA"
    },
    {
        "name": "Maine",
        "abbreviation": "ME"
    },
    {
        "name": "Marshall Islands",
        "abbreviation": "MH"
    },
    {
        "name": "Maryland",
        "abbreviation": "MD"
    },
    {
        "name": "Massachusetts",
        "abbreviation": "MA"
    },
    {
        "name": "Michigan",
        "abbreviation": "MI"
    },
    {
        "name": "Minnesota",
        "abbreviation": "MN"
    },
    {
        "name": "Mississippi",
        "abbreviation": "MS"
    },
    {
        "name": "Missouri",
        "abbreviation": "MO"
    },
    {
        "name": "Montana",
        "abbreviation": "MT"
    },
    {
        "name": "Nebraska",
        "abbreviation": "NE"
    },
    {
        "name": "Nevada",
        "abbreviation": "NV"
    },
    {
        "name": "New Hampshire",
        "abbreviation": "NH"
    },
    {
        "name": "New Jersey",
        "abbreviation": "NJ"
    },
    {
        "name": "New Mexico",
        "abbreviation": "NM"
    },
    {
        "name": "New York",
        "abbreviation": "NY"
    },
    {
        "name": "North Carolina",
        "abbreviation": "NC"
    },
    {
        "name": "North Dakota",
        "abbreviation": "ND"
    },
    {
        "name": "Northern Mariana Islands",
        "abbreviation": "MP"
    },
    {
        "name": "Ohio",
        "abbreviation": "OH"
    },
    {
        "name": "Oklahoma",
        "abbreviation": "OK"
    },
    {
        "name": "Oregon",
        "abbreviation": "OR"
    },
    {
        "name": "Palau",
        "abbreviation": "PW"
    },
    {
        "name": "Pennsylvania",
        "abbreviation": "PA"
    },
    {
        "name": "Puerto Rico",
        "abbreviation": "PR"
    },
    {
        "name": "Rhode Island",
        "abbreviation": "RI"
    },
    {
        "name": "South Carolina",
        "abbreviation": "SC"
    },
    {
        "name": "South Dakota",
        "abbreviation": "SD"
    },
    {
        "name": "Tennessee",
        "abbreviation": "TN"
    },
    {
        "name": "Texas",
        "abbreviation": "TX"
    },
    {
        "name": "Utah",
        "abbreviation": "UT"
    },
    {
        "name": "Vermont",
        "abbreviation": "VT"
    },
    {
        "name": "Virgin Islands",
        "abbreviation": "VI"
    },
    {
        "name": "Virginia",
        "abbreviation": "VA"
    },
    {
        "name": "Washington",
        "abbreviation": "WA"
    },
    {
        "name": "West Virginia",
        "abbreviation": "WV"
    },
    {
        "name": "Wisconsin",
        "abbreviation": "WI"
    },
    {
        "name": "Wyoming",
        "abbreviation": "WY"
    }
];

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
    
    } else if(name === 'age_to'){

        langOptions = {'0':'0', '10':'10', '20':'20', '30':'30', '40':'40', '50':'50', '60':'60', '70':'70', '80':'80', '90':'90'};

        optionDefault = 'Age To';
    
    } else if(name === 'state'){

        optionDefault = 'State';

    } else if(name === 'year'){

        optionDefault = 'Year';

    } else if(name === 'month'){

        optionDefault = 'Month';

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

        if(name === 'state'){
            value = value.abbreviation;
        }

        if(value.length) {
            options.push({
                value: value.trim(),
                selected: d.filters[name] === value.trim() ? 'selected' : false,
                text: langOptions[value] || value
            })
        }
    });

    return options;
}

module.exports = function(d, cb) {

    console.log(d.filters['zip']);
    console.log(d.filters['zip']);

    function fetchAllComplete(){

        console.log(feSchema.properties.person.type.schema.properties.sex.enum);

        log('trace', 'feSchema 1', feSchema.properties.person);

        var filterModel = {
            userFilter: [],
            publicFilter: []
        };

        filterModel.userFilter.push({
            input_type_select: true,
            name: 'record_state',
            options: buildOptions('record_state', RECORD_STATUS_ATTRIBUTES, d)
        });

        filterModel.userFilter.push({
            input_type_select: true,
            name: 'assignee',
            options: buildOptions('assignee', ASSIGNEE_ATTRIBUTES, d)
        });

        if(!d.charts){
            filterModel.publicFilter.push({
                input_type_text: true,
                name: 'name',
                value: d.filters['name'],
                placeholder: 'Name',
            });
        }

        filterModel.publicFilter.push({
            input_type_select: true,
            name: 'sex',
            options: buildOptions('sex', feSchema.properties.person.type.schema.properties.sex.enum, d)
        });

        filterModel.publicFilter.push({
            input_type_select: true,
            name: 'age_from',
            options: buildOptions('age_from', ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90'], d)
        });

        filterModel.publicFilter.push({
            input_type_select: true,
            name: 'age_to',
            options: buildOptions('age_to', ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90'], d)
        });

        filterModel.publicFilter.push({
            input_type_select: true,
            name: 'race',
            options: buildOptions('race', feSchema.properties.person.type.schema.properties.race.items.enum, d)
        });

        filterModel.publicFilter.push({
            input_type_select: true,
            name: 'state',
            options: buildOptions('state', states, d)
        });

        /*
        filterModel.publicFilter.push({
            input_type_text: true,
            name: 'zip',
            value: d.filters['zip'],
            placeholder: 'Postal Code',
        });
        */

        filterModel.publicFilter.push({
            input_type_select: true,
            name: 'year',
            options: buildOptions('year', ['2010', '2011', '2012', '2013', '2014', '2015', '2016'], d)
        });

        filterModel.publicFilter.push({
            input_type_select: true,
            name: 'month',
            options: buildOptions('month', ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], d)
        });

        filterModel.publicFilter.push({
            input_type_select: true,
            name: 'cause',
            options: buildOptions('cause', feSchema.properties.death.type.schema.properties.cause.enum, d)
        });

        filterModel.name = d.filters.name || null;

        filterModel.postURL = d.url_current;

        filterModel.limit = d.filters.limit;

        filterModel.user = d._user;

        filterModel.chart = d.chart;

        cb(null, filterModel);
    }

    fetchAllComplete();
};
