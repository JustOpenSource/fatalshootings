module.exports = function(items, filter){



    /*
    filter = {}
    
    //attribute filters
    filter.sex
    filter.race
    filter.cause
    filter.age_from
    filter.age_to
    */
    function processResults(items, filter){
        let filteredItems = [];

        filteredItems = items;

        //logics

        return filteredItems;
    }
    

    /*

    values for each attribute can be found in src/schemas

    return data should include all the attributes in the dataset that weren't filtered by.

    for example, if you filtered by a specific cause of death, you would get an object with the rest of the atribute frequencies

    the logic should account for more attributes being added to the source dataset

    {
        race: {
            white/caucasion: 200,
            asain: 200,
            ...
        },

        sex: {
            male: 200,
            femail: 200,
            ...
        }
    }, 

    
    */
    return processResults(items, filter);
}