var feJSON = require('../../data/fe.json');
var GoogleSpreadsheet = require('google-spreadsheet');
var _ = require('underscore');

var GOOGLE_DOC_ID = '1dKmaV_JiWcG8XBoRgP8b4e9Eopkpgt7FL7nyspvzAsE';
var GOOGLE_WORKSHEET_INDEX = 0;

var fs = require('fs');

class ImportGoogleDoc {
    constructor() {
        this.doc = new GoogleSpreadsheet(GOOGLE_DOC_ID);
        this.originalCollection = [];
        this.transformedCollection = [];
    }

    getMapping(key) {
        const map = {
            'uniqueidentifier'                                          : 'id',
            'subjectsname'                                              : 'person_name',
            'subjectsage'                                               : 'person_age',
            'subjectsgender'                                            : 'person_gender',
            'subjectsrace'                                              : 'person_race',
            'urlofimageofdeceased'                                      : 'person_img_url',
            'dateofinjuryresultingindeathmonthdayyear'                  : 'death_date',
            'locationofinjuryaddress'                                   : 'death_location_address',
            'locationofdeathcity'                                       : 'death_location_city',
            'locationofdeathstate'                                      : 'death_location_state',
            'locationofdeathzipcode'                                    : 'death_location_zip',
            'locationofdeathcounty'                                     : 'death_location_county',
            'agencyresponsiblefordeath'                                 : 'death_agency',
            'causeofdeath'                                              : 'death_cause',
            'abriefdescriptionofthecircumstancessurroundingthedeath'    : 'death_description',
            'officialdispositionofdeathjustifiedorother'                : 'death_disposition',
            'linktonewsarticleorphotoofofficialdocument'                : 'sources', //make array
            'symptomsofmentalillness'                                   : 'person_mentalillness',
            'uniqueidentifiersubmittedby'                               : 'workflow_submittedby',
            'statedatastatus'                                           : 'workflow_status',
            'datedescription'                                           : 'death_dateanddescription',
            'timestamp'                                                 : 'timestamp',
        }

        return map[key];
    }

    getDoc(cb) {

        cb(require(__dirname + "/../../data/temp.json"));

        return;

        var t = this;

        function getRows(sheet, cb) {
            sheet.getRows({
                offset: 0,
            },(err, rows)=>{
                t.originalCollection = rows;
                cb(transformModel());
            });
        }

        function transformModel() {
            t.originalCollection.forEach((item, index)=>{

                t.transformedCollection[index] = {};

                Object.keys(item).forEach((key)=>{

                    const mapping = t.getMapping(key); 

                    if(item[key] === ''){
                        item[key] = null;
                    }

                    if(mapping){
                        t.transformedCollection[index][t.getMapping(key)] = item[key];
                    }
                })
            });

            /*
            fs.writeFile(__dirname + "/../../data/temp.json", JSON.stringify(t.transformedCollection), function(err) {
                if(err) {
                    return console.log(err);
                }

                console.log("The file was saved!");
            });
            */

            
            return t.transformedCollection;
        }

        t.doc.getInfo((err, data)=>{
            var mainSheet = data.worksheets[GOOGLE_WORKSHEET_INDEX];
            getRows(mainSheet, cb);
        });
    }
}

module.exports = ImportGoogleDoc;