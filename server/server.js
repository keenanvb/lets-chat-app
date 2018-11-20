const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
let {
  generateMessage,
  generateLocationMessage
} = require('./utils/message');
let {
  isString
} = require('./utils/validation');
let {
  Users
} = require('./utils/users');

let moment = require('moment');
let date = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
let users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  //socket.emit           //msg only to this this socket
  //socket.broadcast.emit //msg to everyone excluding this socket
  //io.emit               //msg to everyone including this socket

  console.log('Server: New user connected');

  socket.on('join', (params, callback) => {
    if (!isString(params.name) || !isString(params.room)) {
      return callback('Name and Room name is required');
    }

    socket.join(params.room);
    //remove from previous rooms
    users.removeUser(socket.id);

    //Add user to list
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    // msg only the socket connections
    socket.emit('newMessage', generateMessage('Admin', 'Welcome  to the chat'));

    //msg everyone expect this socket /tab1 broadcast event - tab2 will receive the msg
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined the chat`));

    callback();
  })



  // msg only the socket connections
  //socket.emit('newMessage', generateMessage('Admin', 'Welcome  to the chat'));

  //msg everyone expect this socket /tab1 broadcast event - tab2 will receive the msg
  //socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user has joined the chat'));

  socket.on('createMessage', (message, callback) => {
    let user = users.getUser(socket.id);

    if (user && isString(message.text)) {
      //msg to everyone including this socket
      //io.emit('newMessage', generateMessage(message.from, message.text));

      // Send msg to users in the chat room
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }

    //console.log('createMessage', message);

    callback();
    //msg everyone expect this socket /tab1 broadcast event - tab2 will receive the msg
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

  socket.on('createLocationMessage', (coordinates) => {
    let user = users.getUser(socket.id);

    if (user) {
      //msg to everyone including this socket
      //io.emit('newLocationMessage', generateLocationMessage('Admin', coordinates.lat, coordinates.lng));

      // Send msg to users in the chat room
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coordinates.lat, coordinates.lng));
    }

  })

  socket.on('disconnect', () => {
    console.log('User was disconnected');
    //remove user when disconnects
    let user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      //io.to(params.room).emit('updateUserList', users.getUserList(params.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the chat`));
    }
  });

});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});