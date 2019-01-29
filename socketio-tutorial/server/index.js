const cors = require('cors');
var app = require('express')();
app.use(cors());
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);
// WARNING: app.listen(80) will NOT work here!

app.get('/', function (req, res) {
  res.send('hello from socket server');
});

io.on('connection', function (socket) {

  socket.on('message', function (data) {
    console.log(data);
    socket.emit(server,'server response : '+new Date().getTime());
  });

  socket.on('disconnect', function () { 
    console.log('disconnect');
  });

});
