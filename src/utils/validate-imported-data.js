var Doc = require('../utils/import-data');

class ValidateImportedData {
    constructor(){
        var t = this;
        this.invalidEntries = [];
        this.docData = new Doc();
        this.docData.getDoc(function(collection){
            t.validateEntries(collection);
        });
    }

    validateEntries(collection){
        var t = this;
        collection.forEach(function(entry){
            if(Object.keys(entry).length < 20){
                //console.log(Object.keys(entry).length)
                t.invalidEntries.push(entry);
            }
        });

        console.log('invalid entries');
        console.log(t.invalidEntries.length);
    }

    validateEntry(entry){

    }

    writeReport(entry){

    }
}

new ValidateImportedData();
