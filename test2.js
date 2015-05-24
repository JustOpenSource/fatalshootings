var c = require('./shared-config/constants');
var MongoClient = require('mongodb').MongoClient;

var url = c.url.mongo + c.db.fatalities;

var mappings = {
    'African-American/Black': 'Black',
    'European-American/White': 'White',
    'Unknown race': 'Unknown',
    'Hispanic/Latino': 'Hispanic',
    'Native American/Alaskan': 'Native American',
    'null': 'Unknown',
    'Unknown': 'Unknown',
    'Asian': 'Asian',
    'Eureopean-American/White': 'White',
    'European-American/White, Pacific Islander': 'Pacific Islander',
    'Hispanic-Latino': 'Hispanic',
    'White': 'White',
    'Race Unknown': 'Unknown',
    'Unreported': 'Unknown',
    'Unknown Race': 'Unknown',
    'Middle Eastern': 'Middle Eastern',
    'unknown race': 'Unknown',
    'African-American': 'Black',
    'Pacific Islander': 'Pacific Islander',
    'African American/Black': 'Black',
    'European-American/White, Hispanic/Latino': 'Hispanic',
    'European-American/White ': 'White',
    'Race unknown': 'Unknown',
    'European-American/White, Unknown race': 'Unknown',
    'Haitian-American': 'Black',
    'Mixed': 'Unknown',
    'Native American': 'Native American',
    'European-American/White, African-American/Black, Mixed': 'Black',
    'African-American/Black, Sudanese': 'Black',
    'Hispanic/Latino/Latino': 'Hispanic',
    'European-American/White, Asian, Mixed': 'White',
    'Hispanic/Latina': 'Hispanic',
    'European-American': 'White',
    'European American/white': 'White',
    'African-American/Black, Unknown race': 'Black'
}

MongoClient.connect(url, function(err, db) {

    if(err) throw err;
    
    var collection = db.collection(c.collection.fatalities);
    
    collection.find({}).toArray(function(err, data) {
    
        var cleaned = data.map(function(fatality) {
            try {
                var reported = fatality.value.subject.race.trim();
                var race = mappings[reported];
                fatality.value.subject.race.trim = fatality.value.subject.race = race;
            } catch (e) {
                console.log('ehh', e);
            }
            return fatality;
        });
    
        collection.drop(function(err, body){
            if (err) throw err;

            var batches = Math.ceil(cleaned.length / 1000);
            for (var i = 0; i < batches; i++) {
                collection.insert(cleaned.slice(i*1000, (i*1000)+1000), function(err, body){
                    if (err) return console.log(err);
                    console.log('imported ' + ((body && body.length) || 0) + ' documents');
                });
            }
        });
    
    });

});