var __base = __base || '../../',
    c = require(__base + 'shared-config/constants');

function getModel(){
	
	if(!o.total){
		c.l('Pagination :ERROR: total is a required option');
		return;
	}

	d.current = d.current || 1;

	var t = this;

	t.d = d;

	var	SIZE = t.o.size || 5,
        
        REQUIRES_ELLIPSES = SIZE + 2,

	    totalPages = t.o.total,
	    inFirstSet = t.d.current <= SIZE - 2;

	    paginationModel = {
	        disablePrev: t.o.current === 1 ? true : false,
	        disableNext: t.o.current === t.d.total ? true : false,
	        allPages : false,
	        firstSet: false,
	        middleSet: false,
	        total: totalPages
	    };


    if (inFirstSet && totalPages > REQUIRES_ELLIPSES) {

    	i = SIZE;

    	paginationModel.firstSet = [];
        
        while(i > 0){
        	
            paginationModel.firstSet[i - 1] = {
                active: t.d.current === i ? true : false,
                number: i
            }

            i--;
        }

    } else if (inFirstSet) {

    	paginationModel.allPages = [];

    	i = totalPages;

        while(i > 0){

            paginationModel.allPages[i - 1] = {
                active: t.d.current === i ? true : false,
                number: i
            }

            i--;
        }

    }  else if (!inFirstSet) {

    	var pageNumber,
    		startingPage = t.d.current - Math.floor(SIZE / 2);

    	paginationModel.middleSet = [];

    	i = SIZE;

        while(i > 0){

            pageNumber = i + startingPage;

            paginationModel.middleSet[i - 1] = {
                active: t.d.current === pageNumber ? true : false,
                number: pageNumber
            }

            i--;
        }
    }

    return paginationModel;
}

/** USAGE
var paginationTest = getPaginationModel({
	total: 50,
	current: 32
});

c.l('paginationTest', paginationTest);
*/

module.exports = getModel;