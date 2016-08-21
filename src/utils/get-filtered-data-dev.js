let data = require('../../data/fe.json');
let filterData = require('./lambda/filter-list-logic');

module.exports = function(filter, cb){
  let filteredData = filterData(data.items, filter);
  cb(null, JSON.stringify({body: filteredData}));
}