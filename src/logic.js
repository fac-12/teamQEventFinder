/*eslint-disable*/
const http = require("http");
const request = require('request');
const queryString = require("querystring");

const router = require('./router.js')


function cleanData(data) {
  var newJSON = [];
  //this is temporary for testing, and as example
  var newObj = {
    name: data._embedded.events[0].name,
    url: data._embedded.events[0].url,
    image: data._embedded.events[0].images[3].url,
    distance: data._embedded.events[0].distance,
    units: data._embedded.events[0].units.toLowerCase(),
    date: data._embedded.events[0].dates.start.dateTime,
    venue: data._embedded.events[0]._embedded.venues[0].name,
    lat: data._embedded.events[0]._embedded.venues[0].location.latitude,
    long: data._embedded.events[0]._embedded.venues[0].location.longitude
  };
  newJSON.push(newObj);
  return newJSON;
}


module.exports = cleanData;
