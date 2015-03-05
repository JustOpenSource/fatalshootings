/**
 * This is a hack for getting the data imported. Something prettier will
 * come by eventually.
 *
 * Also, node is annoying.
 */
var data = require('../sample_data/pfcdata.js');
var _ = require('underscore');
var c = require('../../../shared-config/constants.js');
var es = require('elasticsearch');


var client = new es.Client({
    host: c.elastic.host,
    apiVersion : c.elastic.apiVersion
});

//Pulled this into a method because it was acting funky
function create(client){
    client.indices.delete({index: 'shootings'});
    client.indices.create({index : 'shootings'});

    //Basic mappings for now, we'll build out analyzers later
    client.indices.putMapping({
        index: 'shootings',
        type : 'shooting',
        body : {
            shooting : {
                properties : {
                    cause : {type : 'string'},
                    cause_notes : {type : 'string'},
                    responsible_agency : {type : 'string'},
                    description : {type : 'string'},
                    disposition : {type : 'string'},
                    source_url : {type : 'string', index : 'not_analyzed'},
                    subject : {type : 'string'},
                    age : {type : 'integer'},
                    name : {type : 'string'},
                    race : {type : 'string'},
                    image_url : {type : 'string', index : 'not_analyzed'},
                    mental_illness : {type : 'string'},
                    city : {type : 'string'},
                    county : {type : 'string'},
                    state : {type : 'string'},
                    zipcode : {type : 'string'},
                    submitted_by : {type : 'string'},
                    published : {type : 'boolean'}
                }
            }
        }
    });
}
_.each(data.rows, function(val, key){
    client.create({
        index : 'shootings',
        type : 'shooting',
        body : {
            id : val.id,
            cause : val.value.death.cause,
            cause_notes : val.value.death.cause_notes,
            responsible_agency : val.value.death.responsible_agency,
            description : val.value.death.description,
            disposition : val.value.death.disposition,
            source_url : val.value.death.source_url,
            age : val.value.subject.age,
            name : val.value.subject.name,
            race : val.value.subject.race,
            image_url : val.value.subject.image_url,
            mental_illness : val.value.subject.mental_illness,
            city : val.value.location.city,
            county : val.value.location.county,
            state : val.value.location.state,
            zipcode : val.value.location.zipcode,
            submitted_by : val.submitted_by,
            published : val.published
        }

    });
});
