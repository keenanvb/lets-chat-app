const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
let {
  generateMessage,
  generateLocationMessage
} = require('./utils/message');
let moment = require('moment');
let date = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('Server: New user connected');

  // msg only the socket connections
  socket.emit('newMessage', generateMessage('Admin','Welcome  to the chat'));

  //msg everyone expect this socket /tab1 broadcast event - tab2 will receive the msg
  socket.broadcast.emit('newMessage', generateMessage('Admin','New user has joined the chat'));

  socket.on('createMessage', (message,callback) => {
    console.log('createMessage', message);
    //msg to everyone including this socket
    io.emit('newMessage',  generateMessage(message.from,message.text));
    callback('this is from the server');
    //msg everyone expect this socket /tab1 broadcast event - tab2 will receive the msg
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  }); 

  socket.on('createLocationMessage',(coordinates)=>{
    io.emit('newLocationMessage',  generateLocationMessage('Admin',coordinates.lat,coordinates.lng));
  })

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});