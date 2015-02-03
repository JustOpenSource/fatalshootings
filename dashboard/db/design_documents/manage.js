designDoc = {};
designDoc.name = "manage";
designDoc.views = {
    "preview_list" : {
        "map" : function(doc){
                entry = {
                    subject: {
                        name: doc.value.subject.name,
                        age: doc.value.subject.age,
                        sex: doc.value.subject.sex,
                        race: doc.value.subject.race
                    },
                    date: doc.value.death.event.date,
                    cause: doc.value.death.cause,
                    location: {
                        state: doc.value.location.state
                    }
                }

                emit(doc._id, entry);
        }
    },
    //experimenting with how to do a name search
    "names" : {
        "map" : function(doc){
            if(doc.value.subject.name){
                var names = [];
                var name = doc.value.subject.name.split(' ');
                var name1 = name[0] || '',
                    name2 = name[1] || '',
                    name3 = name[2] || '',
                    name4 = name[3] || '',
                    name5 = name[4] || '';

                emit([name1, name2, name3, name4, name5], doc._id);
                
            }
        }
    }
};

module.exports = designDoc;