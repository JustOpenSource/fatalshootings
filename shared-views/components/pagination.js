var __base = __base || '../../',
    c = require(__base + 'shared-config/constants'),
    log = c.getLog(c.log, 'shared-views/pagination'),
    DEFAULT_CURRENT = 1,
    DEFAULT_SIZE = 5,
    DEFAULT_LIMIT = 10;

/*
d
d.count {int} - required - total number of pages,
d.limit {int} entries per page, has a default
d.current {int} current page number, has a default
*/

function getModel(d){

	if(!d.count){
		log('error',  'pagination model requires d.count');
		return;
	}

    log('trace', 'data object passed in to the pagination model', d);

	d.current = d.current || DEFAULT_CURRENT;

    d.limit = d.limit || DEFAULT_LIMIT;

	d.size = d.size || DEFAULT_SIZE;
        
    d.total = Math.ceil(d.count / d.limit);

    var REQUIRES_ELLIPSES = d.size + 2,

	    inFirstSet = d.current <= d.size - 2;

	    paginationModel = {
	        disablePrev: d.current === 1 ? true : false,
	        disableNext: d.current === d.total ? true : false,
	        allPages : false,
	        firstSet: false,
	        firstSep: false,
            middleSet: false,
            LastSep: false,
            lastSet: false,
	        total: d.total
	    };

    //the current page is within the first set
    //and there are more pages than the amount of page links being displayed
    if (inFirstSet && d.total > REQUIRES_ELLIPSES) {

        log('trace', 'd.current is part of the first set and there are more pages');

    	i = d.size;

    	paginationModel.firstSet = [];
        
        while(i > 0){
        	
            paginationModel.firstSet[i - 1] = {
                active: d.current === i ? true : false,
                number: i
            }

            i--;
        }

        paginationModel.lastSep = true;

        paginationModel.lastSet = [{
            active: false,
            number: d.total
        }];

    //the current page is within the first set and 
    //and the first set contains all of the pages
    } else if (inFirstSet) {

        log('trace', 'd.current is part of the first set and contains all pages');

    	paginationModel.allPages = [];

    	i = d.total;

        while(i > 0){

            paginationModel.allPages[i - 1] = {
                active: d.current === i ? true : false,
                number: i
            }

            i--;
        }

    //the current page is past the first set 
    //and there are pages beyond the currently showing set
    }  else if (!inFirstSet && (d.current <= d.total - d.size)) {

        log('trace', 'd.current is part of the middle set');

    	var pageNumber,
    		startingPage = d.current - Math.floor(d.size / 2);
            startingPage = d.size % 2 ? startingPage - 1 : startingPage;

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

        paginationModel.firstSep = true;
        paginationModel.lastSep = true;

        paginationModel.firstSet = [{
            active: false,
            number: 1
        }];

        paginationModel.lastSet = [{
            active: false,
            number: d.total
        }];

    //the current page is in the last set
    } else {

        log('trace', 'd.current is part of the last set');

        var pageNumber,
            startingPage = d.current - Math.floor(d.size / 2);

        paginationModel.lastSet = [];

        i = d.size;

        while(i > 0){

            pageNumber = d.total - i + 1;

            paginationModel.lastSet[d.size - i] = {
                active: d.current === pageNumber ? true : false,
                number: pageNumber
            }

            i--;
        }

        paginationModel.firstSet = [{
            active: false,
            number: 1
        }];

        paginationModel.firstSep = true;
    }

    log('trace', 'paginationModel', paginationModel)

    return paginationModel;
}

/*/ USAGE
var paginationTest = getModel({
	total: 50,
	current: 32
});

log('trace', 'paginationTest', paginationTest);
/**/

module.exports = getModel;