designDoc = {};
designDoc.name = "counts";
designDoc.views = {
    "age" : {
        "map" : function(doc){
            var age = '18',
                currAge = parseInt(doc.value.subject.age);

            if(currAge >= 19 && currAge <= 35){
                age = '19-35';
            } else if(currAge >= 36 && currAge <= 50){
                age = '36-50';
            } else if(currAge >= 51){
                age = '51';
            }

            emit(age, 1);
        },

        "reduce" : "_sum"
    },

    "cause" : {
        "map" : function(doc){
            emit(doc.value.death.cause, 1);
        },

        "reduce" : "_sum"
    },

    "sex" : {
        "map" : function(doc){
            emit(doc.value.subject.sex, 1);
        },

        "reduce" : "_sum"
    },

    "race" : {
        "map" : function(doc){
            emit(doc.value.subject.race, 1);
        },

        "reduce" : "_sum"
    },

    "state" : {
        "map" : function(doc){
            emit(doc.value.location.state, 1);
        },

        "reduce" : "_sum"
    }
};

module.exports = designDoc;