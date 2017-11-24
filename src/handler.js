/*eslint-disable*/

const request = require('request');
const fs = require('fs');
const path = require('path');
const cleanData = require('./logic');
const querystring = require('querystring');

const api_key = process.env.API_KEY;

const homeHandler = (request, response) => {
  const filePath = path.join(__dirname, '..', 'public', 'index.html')
  fs.readFile(filePath, function (err, file) {
    if (err) {
      response.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      response.end('Server error');
    }
    response.writeHead(200, {
      'Content-Type': 'text/html'
    });
    response.end(file);
  })
}

const staticFileHandler = (request, response, endpoint) => {
  const extensionType = {
    html: 'text/html',
    css: 'txt/css',
    js: 'application/javascript',
    ico: 'image/x-icon'
  }
  const extension = endpoint.split('.')[1];
  const filePath = path.join(__dirname, '..', endpoint)
  fs.readFile(filePath, function (err, file) {
    if (err && err.code === 'ENOENT') {
      response.writeHead(404, {
        'Content-Type': 'text/plain'
      });
      response.end('404 Not Found');
    } else if (err) {
      response.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      response.end('Server error');
    } else {
      response.writeHead(200, 'Content-Type: ' + extensionType[extension]);
      response.end(file);
    }
  })
}

const searchHandler = (req, response, endpoint) => {
  var queries = querystring.parse(endpoint.split("?")[1]);
  let buildUrl = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + api_key + "&latlong=" + queries.ll + "&radius=" + queries.radius + "&unit=miles&sort=date,asc";
  if (queries.sdate) {
    buildUrl += "&startDateTime=" + queries.sdate + "T00:00:00Z";
  }
  if (queries.edate) {
    buildUrl += "&endDateTime=" + queries.edate + "T23:59:59Z";
  }
  const options = {
    url: buildUrl,
    method: 'GET'
  };
  request(options, (err, res, body) => {
    if (err) {
      console.log("error :", error);
    }
    var outcome = parseResponse(body);
    var newOutcome = cleanData(outcome);
    response.writeHead(200, {
      "Content-Type": "text/html"
    });
    response.end(JSON.stringify(newOutcome));
  });
};

function parseResponse(response){
  try {
    return JSON.parse(response);
  } catch (e) {
    return JSON.parse(JSON.stringify(response));
  }
}

module.exports = {
  homeHandler,
  staticFileHandler,
  searchHandler
};
