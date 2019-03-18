
var moment = require('moment');
var date = moment().format('L');
var today = moment().format('LLLL');

var splitDate = date.split('/');

var currentDate= '';
var x = 0
var newDate = splitDate.map(index => {
    x++
    if (x < splitDate.length) {
        currentDate += index + '-'       
        return currentDate
    }
    else {
        currentDate += index
        return currentDate
    }
});
currentDate.trim();

module.exports = {
    date: today,
    day: currentDate
}