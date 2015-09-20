__base = __base || '../';
var c = require(__base + 'constants');
var log = c.getLog('views/fatality-list-filter');
var httpGet = require(__base + 'utils/http-get');
var q = require('q');
var _ = require('underscore');
var feSchema = require(__base + 'schemas-cache/fe.1.json');
var getSchemaLang = require(__base + 'utils/schema-lang-get');

module.exports = function(d, cb) {

    var personLangOptions = getSchemaLang('person', d._str._lang);
    var deathLangOptions = getSchemaLang('death', d._str._lang);

    function buildOptions(name, attributes){

        var langOptions = {};
        var options = [];
        var optionDefault = d._str.select_label_prefix + ' ';

        if(name === 'sex'){

            langOptions = personLangOptions.sex;

            optionDefault = optionDefault + d._str.select_label_sex;

        } else if(name === 'race'){

            langOptions = personLangOptions.race;

            optionDefault = optionDefault + d._str.select_label_race;

        } else if(name === 'cause'){

            langOptions = deathLangOptions.cause;

            optionDefault = optionDefault + d._str.select_label_cause;
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
                    selected: d.filters[name] == value.trim() ? 'selected' : false,
                    text: langOptions[value]
                })
            }
        });

        return options;
    }

    function fetchAllComplete(){

        log('trace', 'feSchema 1', feSchema.properties.person);

        var filterModel = {
            select: []
        };

        filterModel.select.push({
            name: 'sex',
            options: buildOptions('sex', feSchema.properties.person.type.schema.properties.sex.enum)
        });

        filterModel.select.push({
            name: 'race',
            options: buildOptions('race', feSchema.properties.person.type.schema.properties.race.items.enum)
        });

        filterModel.select.push({
            name: 'cause',
            options: buildOptions('cause', feSchema.properties.death.type.schema.properties.cause.enum)
        });

        filterModel.name = d.filters.name || null;

        filterModel.postURL = d.url_current;

        cb(null, filterModel);
    }

    fetchAllComplete();
};
