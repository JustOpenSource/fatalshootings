db['test-fatalities'].group( {
    $keyf: function(doc) {
        return { 'value.subject.race' : doc.value.subject.race };
    },
    reduce: function(cur, result) { 0
        result.count++ 
    },
    initial: { count: 0 }
});

db['test-fatalities'].group( {
    $keyf: function(doc) {
        return { 'value.subject.age' : doc.value.subject.age };
    },
    reduce: function(cur, result) { 
        result.count++;
    },
    initial: { count: 0 }
});

db['test-fatalities'].group( {
    $keyf: function(doc) {
        return { 'value.death.cause' : doc.value.death.cause };
    },
    reduce: function(cur, result) { 
        result.count++ 
    },
    initial: { count: 0 }
});

db['test-fatalities'].group( {
    $keyf: function(doc) {
        return { 'value.location.state' : doc.value.location.state };
    },
    reduce: function(cur, result) {
        result.count++;
        result.name = cur.value.subject.name;
    },
    initial: { count: 0 }
});