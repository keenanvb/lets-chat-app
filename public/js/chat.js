var socket = io();
//moment().format("h:mm:ss a");
socket.on('connect', function () {
  let params = getParams;
  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/'
    } else {
      console.log('no errors lets chat')
    }
  });
  console.log('Connected to server');
});


function getUrlVars() {
  let url = new URL(window.location.href);
  console.log('url', url);
  var name = url.searchParams.get("name");
  var room = url.searchParams.get("room");
  return {
    name: name,
    room: room
  }
}

let getParams = getUrlVars();

function scrollToBottom() {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child')
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('updateUserList',function(users){
  console.log('user List',users);
  var ol = jQuery('<ol></ol>');
  users.forEach(function(user){
    ol.append(jQuery('<li></li>').text(user));
  })

  jQuery('#users').html(ol); 
});

socket.on('newMessage', function (newMessage) {
  var formatedTime = moment(newMessage.createdAt).format("h:mm a");
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    from: newMessage.from,
    text: newMessage.text,
    createdAt: formatedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
  // var formatedTime = moment(newMessage.createdAt).format("h:mm a");
  // console.log('newMessage', newMessage);
  // var li = jQuery('<li></li>');
  // li.text(`${newMessage.from} ${formatedTime}: ${newMessage.text}`);
  // jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
  console.log('location', message);
  var formatedTime = moment(message.createdAt).format("h:mm a");
  //var li = jQuery('<li></li>');
  //var a = jQuery('<a target="_blank">My location</a>')
  //li.text(`${message.from} ${formatedTime}: `);
  //a.attr('href', message.url)
  //li.append(a);
  //jQuery('#messages').append(li);
  console.log('message.url', message.url);
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formatedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
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
  var messageTextBox = jQuery('[name=message]');

  socket.emit('createMessage', {
    from: 'Anon',
    text: messageTextBox.val()
  }, function (data) {
    messageTextBox.val('')
  });

});

var locationButton = jQuery('#send-location');

locationButton.on('click', function () {

  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }
  locationButton.attr('disabled', 'disabled').text('Sending location...');
  navigator.geolocation.getCurrentPosition(function (position) {
    console.log(position, position.coords.latitude, position.coords.longitude);
    socket.emit('createLocationMessage', {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    });
    locationButton.removeAttr('disabled').text('Send location');
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    console.log('Unable to find location');
  });
});