var __base = __base || '../../',
    c = require(__base + 'shared-config/constants');

function getPaginationModel(o){
	
	if(!o.total){
		c.l('Pagination :ERROR: total is a required option');
		return;
	}

	o.current = o.current || 1;

	var t = this;

	t.o = o;

	var	SIZE = t.o.size || 5,
        
        REQUIRES_ELLIPSES = SIZE + 2,

	    totalPages = t.o.total,
	    inFirstSet = t.o.current <= SIZE - 2;

	    paginationModel = {
	        disablePrev: t.o.current === 1 ? true : false,
	        disableNext: t.o.current === t.o.total ? true : false,
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
                active: t.o.current === i ? true : false,
                number: i
            }

            i--;
        }

    } else if (inFirstSet) {

    	paginationModel.allPages = [];

    	i = totalPages;

        while(i > 0){
            c.l(i);

            paginationModel.allPages[i - 1] = {
                active: t.o.current === i ? true : false,
                number: i
            }

            i--;
        }

    }  else if (!inFirstSet) {

    	var pageNumber,
    		startingPage = t.o.current - Math.floor(SIZE / 2);

    	paginationModel.middleSet = [];

    	i = SIZE;

        while(i > 0){
            c.l(i);

            pageNumber = i + startingPage;

            paginationModel.middleSet[i - 1] = {
                active: t.o.current === pageNumber ? true : false,
                number: pageNumber
            }

            i--;
        }
    }

    return paginationModel;
}

var paginationTest = getPaginationModel({
	total: 50,
	current: 32
});

c.l('paginationTest', paginationTest);

module.export = getPaginationModel;