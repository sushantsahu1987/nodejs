var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);
// WARNING: app.listen(80) will NOT work here!

app.get('/', function (req, res) {
  res.send('')
});

io.on('connection', function (socket) {
  socket.emit('hello', { hello: 'world' });
  socket.on('bye', function (data) {
    console.log(data);
  });
});
