var __base = __base || '../',
    c = require(__base + 'shared-config/constants'),
    log = c.getLog('shared-views/fatality-list-filter'),
    
    mongodb = require(__base + 'shared-utils/mongo-db'),

    DATABASE = c.db.fatalities,
    COLLECTION = c.collection.fatalities,
    DEFAULT_LIMIT = 10;

module.exports = function (d, cb) {
	log('trace', 'called');
};