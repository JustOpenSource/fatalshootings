designDoc = {};
designDoc.name = "test5";
designDoc.views = {
    "all" : {
        "map" : function(doc){
            if(doc._id.indexOf('fatality') === 0){
                emit(doc._id,doc.value);
            }
        }
    },
    "highest_id" : {
        "map" : function(doc){
            if(doc._id.indexOf('fatality') === 0){
                var out = parseInt(doc._id.replace('fatality_','')); 
                emit(out,out);
            }
        },
        "reduce" : "_stats"
    }
};

module.exports = designDoc;