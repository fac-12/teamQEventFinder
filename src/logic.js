/*eslint-disable*/
const http = require("http");
const request = require('request');
const queryString = require("querystring");

const router = require('./router.js')


function cleanData(data) {
  var newJSON = [];
  //this is temporary for testing, and as example
  data._embedded.events.forEach(element => {
    var newObj = {
      name: element.name,
      url: element.url,
      image: element.images[3].url,
      distance: element.distance,
      units: element.units.toLowerCase(),
      date: element.dates.start.dateTime,
      venue: element._embedded.venues[0].name,
      lat: element._embedded.venues[0].location.latitude,
      long: element._embedded.venues[0].location.longitude
    };
    newJSON.push(newObj);
  });
  return newJSON;
}


module.exports = cleanData;
