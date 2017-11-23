/*eslint-disable*/
const http = require("http");
const request = require('request');
const queryString = require("querystring");

const router = require('./router.js')


function cleanData(data) {
  var eventsArray = data._embedded.events;
  var emptyObjForFiltering = {};
  var noRepeat = eventsArray.filter(function(event){
    var key = event.name;
    if (!emptyObjForFiltering[key]) {
      emptyObjForFiltering[key]= true;
      return true;
    }
  });

  var cloneArray = noRepeat.slice(0, 10);
  var newJSON = [];
  cloneArray.forEach(function(event, i){
    newJSON[i] = {};
    newJSON[i].name = event.name;
    newJSON[i].url = event.url;
    newJSON[i].imageUrl = event.images[4].url;
    newJSON[i].distance = event.distance;
    newJSON[i].units = event.units;
    newJSON[i].date = event.dates.start.localDate;
    newJSON[i].time = event.dates.start.localTime;
    newJSON[i].venue = event._embedded.venues[0].name;
    newJSON[i].lat = event._embedded.venues[0].location.latitude;
    newJSON[i].long = event._embedded.venues[0].location.longitude;
  })
  return newJSON;
}


module.exports = cleanData;
