var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/formatted/',function(req,res){
    var v = require('../db/utils/analysis_view');
    v.get(function(body){
        res.json(body)
    });
});

router.get('/normalized/',function(req,res){
    var v = require('../db/utils/analysis_view');
    v.get(function(body){
        res.send('coming soon');
    });
});

function formattedGet(callback, tried){
    var nano = require('nano')('http://localhost:5984');
    var pf = nano.use('pf');
    if(tried >= 1){
        
        createAnalysisView(function(err,body){
            if(err) throw err
            formattedGet(callback,0);
        });
    }
    pf.get('_design/analysis',{},function(err,body){
        if(err){
            if(err.statusCode === 404){
                formattedGet(callback, tried+1);
            }else{
                throw err;
            }
        }
        callback(body);
    });
}

function createAnalysisView(callback){
    var nano = require('nano')('http://localhost:5984');
    var pf = nano.use('pf');
    var view = function(doc){
        var object = {
            submitted_by: doc.uniqueidentifiersubmittedby ? doc.uniqueidentifiersubmittedby : null, 
            death: {
                cause : doc.causeofdeath ? doc.causeofdeath : null,
                cause_notes: null,
                responsible_agency: doc.agencyresponsiblefordeath ? doc.agencyresponsiblefordeath : null,
                description: doc.abriefdescriptionofthecircumstancessurroundingthedeath ? doc.abriefdescriptionofthecircumstancessurroundingthedeath : null,
                date_description: doc.dateddescription ? doc.datedescription : null,
                disposition: doc.officialdispositionofdeathjustifiedorother ? doc.officialdispositionofdeathjustifiedorother : null,
                source_url: doc.linktonewsarticleorphotoofofficialdocument ? doc.linktonewsarticleorphotoofofficialdocument : null,
                event: {
                    address: doc.locationofinjuryaddress ? doc.locationofinjuryaddress : null,
                    date: doc.dateofinjuryresultingindeathmonthdayyear ? doc.dateofinjuryresultingindeathmonthdayyear : null,
                }
            },
            location: {
                city: doc.locationofdeathcity ? doc.locationofdeathcity : null,
                county: doc.locationofdeathcounty ? doc.locationofdeathcounty : null,
                state: doc.locationofdeathstate ? doc.locationofdeathstate : null,
                zipcode: doc.locationofdeathzipcode ? doc.locationofdeathzipcode : null,
            },
            subject: {
                age: doc.subjectsage ? doc.subjectsage : null,
                type: doc.subjectsgender ? doc.subjectsgender : null,
                name: doc.subjectsname ? doc.subjectsname : null,
                race: doc.subjectsrace ? doc.subjectsrace : null,
                image_url: doc.urlofimageofdeceased ? doc.urlofimageofdeceased : null,
                mental_illness: doc.syptomsofmentalillness ? doc.syptomsofmentalillness : null,
            }
        };
        emit(doc._id, object);
    }
    
    var insert = { 'views': {} }
    insert.views['formatted'] = {
        'map': view
    };
    pf.insert( insert, '_design/analysis' , callback);
}

module.exports = router;