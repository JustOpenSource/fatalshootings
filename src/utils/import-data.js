var feJSON = require('../../fe.json');
var GoogleSpreadsheet = require('google-spreadsheet');
var _ = require('underscore');

var GOOGLE_DOC_ID = '1dKmaV_JiWcG8XBoRgP8b4e9Eopkpgt7FL7nyspvzAsE';
var GOOGLE_WORKSHEET_INDEX = 0;

class ImportGoogleDoc {
    constructor() {
        this.doc = new GoogleSpreadsheet(GOOGLE_DOC_ID);
        this.originalCollection = require(__dirname + '/../../googledump.json');
        this.transformedCollection = [];
        this.transformModel();
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

    getRows(sheet) {
        sheet.getRows({
            offset: 0,
        },(err, rows)=>{
            this.originalCollection = rows;
        });
    }

    getDoc() {
        this.doc.getInfo((err, data)=>{
            var mainSheet = data.worksheets[GOOGLE_WORKSHEET_INDEX];
            getRows(mainSheet);
        });
    }

    transformModel() {

        this.originalCollection.forEach((item, index)=>{

            this.transformedCollection[index] = {};

            Object.keys(item).forEach((key)=>{

                const mapping = this.getMapping(key); 

                if(item[key] === ''){
                    item[key] = null;
                }

                if(mapping){
                    this.transformedCollection[index][this.getMapping(key)] = item[key];
                }
            })
        });

        return this.transformedCollection[0];
    }
}

module.exports = ImportGoogleDoc;