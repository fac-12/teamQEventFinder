/*eslint-disable*/
const http = require("http");
const request = require('request');
const queryString = require("querystring");

const router = require('./router.js')


function cleanData(data) {
  var newJSON = [{name: "test"}];
  return newJSON;
}


module.exports = cleanData;
