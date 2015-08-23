var __base = __base || '../',
    c = require(__base + 'shared-config/constants'),
    log = c.getLog('shared-views/fatality-list-filter'),
    httpGet = require(__base + 'shared-utils/http-get'),

    //node require
    q = require('q'),
    _ = require('underscore'),

    feSchema = require(__base + 'shared-utils/schemas-cache/fe.1.json');

module.exports = function(d, cb) {

    function buildOptions(name, attributes){

        var options = [];

        log('trace', 'buildOptions', attributes);

        var optionDefault = 'All '

        if(name === 'sex'){

            optionDefault = optionDefault + 'sexes'

        } else if(name === 'race'){

            optionDefault = optionDefault + 'races'

        } else if(name === 'cause'){

            optionDefault = optionDefault + 'causes'
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
                    text: value
                })
            }
        });

        return options;
    }

    function fetchAllComplete(){

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
