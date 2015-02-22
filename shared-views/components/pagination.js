var __base = __base || '../../',
    c = require(__base + 'shared-config/constants'),
    DEFAULT_CURRENT = 1,
    DEFAULT_SIZE = 5;

function getModel(d){
	
    c.l('ATTEMPT: build model for pagination view');

	if(!d.total){
		c.l('ERROR: pagination model requires d.total');
		return;
	}

	d.current = d.current || DEFAULT_CURRENT;


	d.size = d.size || DEFAULT_SIZE,
        
        REQUIRES_ELLIPSES = d.size + 2,

	    totalPages = d.total,
	    inFirstSet = d.current <= d.size - 2;

	    paginationModel = {
	        disablePrev: d.current === 1 ? true : false,
	        disableNext: d.current === d.total ? true : false,
	        allPages : false,
	        firstSet: false,
	        middleSet: false,
	        total: totalPages
	    };


    if (inFirstSet && totalPages > REQUIRES_ELLIPSES) {

    	i = d.size;

    	paginationModel.firstSet = [];
        
        while(i > 0){
        	
            paginationModel.firstSet[i - 1] = {
                active: d.current === i ? true : false,
                number: i
            }

            i--;
        }

    } else if (inFirstSet) {

    	paginationModel.allPages = [];

    	i = totalPages;

        while(i > 0){

            paginationModel.allPages[i - 1] = {
                active: d.current === i ? true : false,
                number: i
            }

            i--;
        }

    }  else if (!inFirstSet) {

    	var pageNumber,
    		startingPage = d.current - Math.floor(d.size / 2);

    	paginationModel.middleSet = [];

    	i = d.size;

        while(i > 0){

            pageNumber = i + startingPage;

            paginationModel.middleSet[i - 1] = {
                active: d.current === pageNumber ? true : false,
                number: pageNumber
            }

            i--;
        }
    }

    return paginationModel;
}

/*/ USAGE
var paginationTest = getModel({
	total: 50,
	current: 32
});

c.l('paginationTest', paginationTest);
/**/

module.exports = getModel;