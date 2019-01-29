import io from 'socket.io-client';
const socket = io.connect('http://localhost:8080');


function send(data, cb) {
    console.log('data send');
    socket.emit('message', data);
}


export { send };  

