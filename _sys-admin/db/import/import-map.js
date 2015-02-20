var c = require('../../config/constants');
var analysisView = {
    create: function(callback){

        //TODO: THIS WILL NEED TO BE ADJUSTED TO USE MONGODB
        var nano = require('nano')(c.nano);
        var pf = nano.use('pf');
        //create view as variable
        var view = function(doc){
            var object = {
                submitted_by: doc.uniqueidentifiersubmittedby ? doc.uniqueidentifiersubmittedby : null, 
                death: {
                    cause : doc.causeofdeath ? doc.causeofdeath : null,
                    cause_notes: null,
                    responsible_agency: doc.agencyresponsiblefordeath ? doc.agencyresponsiblefordeath : null,
                    description: doc.abriefdescriptionofthecircumstancessurroundingthedeath ? doc.abriefdescriptionofthecircumstancessurroundingthedeath : null,
                    dated_description: doc.datedescription ? doc.datedescription : null,
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
                    mental_illness: doc.symptomsofmentalillness ? doc.symptomsofmentalillness : null,
                },
                published: true,
            };
            emit(doc._id, object);
        }
        //insert and pass through callback
        pf.insert( {'views': {'formatted': {'map': view} } }, '_design/analysis' , callback);
    },
    get: function(callback, tried, params){
        //default for tried variable
        tried = (typeof tried !== 'undefined') ? tried : 0;
        params = (typeof params !== 'undefined') ? params : {};
        var nano = require('nano')(c.nano);
        var pf = nano.use('pf');
        //if this is the second run through, it means that we need to create the view
        if(tried >= 1){
            this.create(function(err,body){
                if(err) throw err
                analysisView.get(callback);
            });
        }else{
            //attempt to pull data
            pf.view('analysis','formatted',params,function(err,body){
                if(err && err.statusCode === 404){
                    //missing view, retry
                    analysisView.get(callback,tried+1);
                }else if(err){
                    //some other error
                    throw err;
                }else{
                    //body.rows = body.rows.slice(15,25);

                    //view exists, pass on results
                    callback(body);
                }
            })
        }
    }
};

module.exports = analysisView;