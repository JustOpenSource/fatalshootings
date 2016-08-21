const PAGINATION_LIMIT_DEFAULT = 10;
const PAGINATION_LIMIT_MAX = 50;

module.exports = function(items, filter){

    let paginationSet = [];
    let filteredLength;
    
    filter.limit = filter.limit || PAGINATION_LIMIT_DEFAULT;
    if(filter.limit > PAGINATION_LIMIT_MAX){
        filter.limit = PAGINATION_LIMIT_MAX;
    }
    
    filter.skip = filter.skip || 0;

    /*
    filter = {}
    
    //attribute filters
    filter.sex
    filter.race
    filter.cause
    filter.age_from
    filter.age_to
    filter.name
    
    //pagination
    filter.skip
    filter.limit
    */
    function processResults(items, filter){
        let filteredItems = applyFilter(items, filter);
        let paginatedItems = applyPagination(filteredItems, filter);

        return {
            items : paginatedItems,
            count : filteredItems.length
        };
    }
    
    function applyPagination(items, filter){
        return items.slice(filter.skip, filter.skip + filter.limit);
    }

    function applyFilter(items, filter){
        
        function testBase(filterBy, value, body){
            var result = false;

            if(!filterBy){
                return true;
            }

            //try so we don't have to test value path
            try {
                result = body();
            } catch(err){}

            return result;
        }

        function testValue(filterBy, value){
            
            return testBase(filterBy, value, ()=>{
                return value.trim().toLowerCase() === filterBy.toLowerCase()
            });
        }
        
        function testValueCause(filterBy, value){
            return testBase(filterBy, value, ()=>{
                return value.trim().toLowerCase() === filterBy.toLowerCase()
            });
        }

        //TODO: FIX FUZZY TEXT MATCH
        function testText(filterBy, value){
            return testBase(filterBy, value, ()=>{
                //return true;
                
                return filterBy.toLowerCase().trim() === value.toLowerCase().trim();
                //var results = fuzzy.filter(filterBy, [value]);
                //return results.length > 0;
            });
        }

        function testFromNum(filterBy, value){

            //console.log(value);

            return testBase(filterBy, value, ()=>{
                return parseInt(filterBy) <= parseInt(value)
            });
        }

        function testToNum(filterBy, value){
            return testBase(filterBy, value, ()=>{
                return parseInt(filterBy) >= parseInt(value)
            });
        }

        return items.filter((item, index)=>{

            let shouldReturn = false;
        
            if( testValue(filter.sex, item.person_gender)
                && testValue(filter.race, item.person_race)
                && testValueCause(filter.cause, item.death_cause) 
                && testFromNum(filter.age_from, item.person_age) 
                && testToNum(filter.age_to, item.person_age)
                && testText(filter.name, item.person_name) ){

                shouldReturn = true;
            }

            return shouldReturn;
        });
    }

    return processResults(items, filter);
}