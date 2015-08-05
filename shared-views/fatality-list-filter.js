var __base = __base || '../',
    c = require(__base + 'shared-config/constants'),
    log = c.getLog('shared-views/fatality-list-filter'),
    httpGet = require(__base + 'shared-utils/http-get'),

    //node require
    q = require('q'),
    _ = require('underscore');

module.exports = function(d, cb) {
    log('trace', d.filters);

    var filterModel = {
        select: []
    };

    function getDistinct(attribute){
        var deferred = q.defer();

        httpGet(c.url.distinct + attribute, function(err, body){

            if(err) {

                log('error', 'distinct ' + attribute + ' error', err);
                deferred.reject(err);

            } else {

                deferred.resolve({
                    'values': body
                });

            }
        });

        return deferred.promise;
    }

    function buildOptions(name, attributes){

        var options = [];

        log('trace', 'buildOptions', attributes);

        var optionDefault = 'All ';

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
        });

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

    function fetchAllComplete(race, sex, cause){

        log('trace', 'race options', race.values);
        log('trace', 'sex options', sex.values);
        log('trace', 'cause options', cause.values);

        filterModel.select.push({
            name: 'sex',
            options: buildOptions('sex', sex.values)
        });

        filterModel.select.push({
            name: 'race',
            options: buildOptions('race', race.values)
        });

        filterModel.select.push({
            name: 'cause',
            options: buildOptions('cause', cause.values)
        });

        filterModel.name = d.filters.name || null;

        cb(null, filterModel);
    }

    q.all([getDistinct('race'), getDistinct('sex'), getDistinct('cause')]).spread(fetchAllComplete).catch(cb);
};
