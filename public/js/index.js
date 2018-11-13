var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('newMessage', function (newMessage) {
  console.log('newMessage', newMessage);
  var li = jQuery('<li></li>');
  li.text(`${newMessage.from}: ${newMessage.text}`);
  jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
  console.log('location', message);
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My location</a>')
  li.text(`${message.from}: `);
  a.attr('href', message.url)
  li.append(a);
  jQuery('#messages').append(li);
});

// socket.emit('createMessage', {
//   from: 'Keenz',
//   text: 'Hi'
// }, function (data) {
//   console.log('Got it from the server ', data);
// })

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'Anon',
    text: jQuery('[name=message]').val()
  }, function (data) {
    console.log('Got it from the server ', data);
  });

});

var locationButton = jQuery('#send-location');

locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }
  navigator.geolocation.getCurrentPosition(function (position) {
    console.log(position, position.coords.latitude, position.coords.longitude);
    socket.emit('createLocationMessage', {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    });
  }, function () {
    console.log('Unable to find location');
  });
});