let data = require('../../data/fe.json');
let filterData = require('./lambda/filter-chart-logic');

function getFilteredChartData(data, filter){
    return filterData(data.items, filter);
}

module.exports = function(filter, cb){
  let filteredData = getFilteredChartData;
  cb(null, JSON.stringify({body: filteredData}));
}

const testFilter = {

};

let filteredChartData = getFilteredChartData(data, testFilter);

console.log(filteredChartData.length);