const test = require('tape');
const shot = require('shot');
const router = require('../src/router');
const handler = require('../src/handler');


test('Unknown route', (t) => {
  shot.inject(router, { method: 'get', url: '/lol' }, (res) => {
    t.equal(res.statusCode, 404, 'should respond with a status code of 404');
    t.equal(res.payload, '404 resource not found', 'response should contain \'404 resource not found\'');
    t.end();
  });
});

test('Home route', (t) => {
  shot.inject(router, { method: 'get', url: '/' }, (res) => {
    t.equal(res.statusCode, 200, 'should respond with a status code of 200');
    t.end();
  });
});
