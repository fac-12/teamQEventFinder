/*eslint-disable*/

const fs = require('fs');
const path = require('path');



var homeHandler = (request, response) => {
  var filePath = path.join(__dirname, '..', 'public', 'index.html')
  fs.readFile(filePath, function(err, file) {
    if(err){
      response.writeHead(500, {'Content-Type':'text/plain'});
      response.end('Server error');
    }
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(file);
  })
}

var staticFileHandler = (request, response, endpoint) => {
  var extensionType = {
    html: 'text/html',
    css: 'txt/css',
    js: 'application/javascript',
    ico: 'image/x-icon'
  }
  var extension = endpoint.split('.')[1];
  var filePath = path.join(__dirname, '..', endpoint)
  fs.readFile(filePath, function(err, file) {
    if(err && err.code === 'ENOENT'){
      response.writeHead(404, {'Content-Type':'text/plain'});
      response.end('404 Not Found');
    }
    else if(err){
      response.writeHead(500, {'Content-Type':'text/plain'});
      response.end('Server error');
    }
    else {
    response.writeHead(200, 'Content-Type: ' + extensionType[extension]);
    response.end(file);
  }
  })
}

module.exports = {homeHandler, staticFileHandler};
