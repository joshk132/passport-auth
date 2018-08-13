#!/usr/bin/env node

var debug = require('debug')('app');
var app = require('./server/app');

const port = process.env.PORT || 3000;

var server = app.listen(port, function() {
  console.log('Express server listening on port ' + server.address().port);
});