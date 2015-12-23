var server = require('http').createServer();
var url = require('url');
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
  server: server
});
var express = require('express');
var app = express();
var port = 8080;

app.use(express.static('public'));

var backend = {
  actionInitial: function(data, input, output) {
    var send = {};
    output.forEach(function(elem) {
      send[elem] = elem + ' serverDataInitial';
    }.bind(this));
    return send;
  },
  actionSave: function(data, input, output) {
    var result = {};
    result.elemB = data.elemA + 'Server Data';
    result.elemC = data.elemA + 'Server Data 1';
    return result;
  },
  actionSave1: function(data, input, output) {
    var result = {};
    result.elemE = data.elemA + 'Server Data 2';
    result.elemF = data.elemD + 'Server Data 3';
    return result;
  }
};

wss.on('connection', function connection(ws) {
  var location = url.parse(ws.upgradeReq.url, true);
  // you might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    var msg = JSON.parse(message);

    var input = msg.input.split(',');
    var output = msg.output.split(',');
    var result = backend[msg.action](msg.data, input, output);
    result.id = msg.id;
    ws.send(JSON.stringify(result));
  });

});

server.on('request', app);
server.listen(port, function() {
  console.log('Listening on ' + server.address().port);
});
