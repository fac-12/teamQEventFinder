/*eslint-disable*/
const http = require("http");
const request = require('request');
const queryString = require("querystring");
const api_key = process.env.API_KEY;
const router = require('./router.js')


const getLatLong = (endpoint) => {
    var latlong = endpoint.split("=")[1];
    return "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + api_key + "&latlong=" + latlong;
}

const ticketmasterApi = (endpoint) => {
  const options = {
    url: getLatLong(endpoint),
    method: 'GET'
  }
  request(options, (err, response, body) => {
    if(err){
      console.log("error :", error);
    }
    var outcome = JSON.parse(body);
    console.log(outcome._embedded.events[0].images)
    return outcome;
  })
}


module.exports = ticketmasterApi;
