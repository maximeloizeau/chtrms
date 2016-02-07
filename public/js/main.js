var Vue = require('vue');
var request = require('browser-request');

var userController = require('./controllers/user.js');
var roomController = require('./controllers/room.js');
var chatController = require('./controllers/chat.js');

var store = {
  state: {
    user: undefined,
    room: undefined,
    rooms: undefined,
    socket: undefined,
    messages: []
  }
}

// Define some components
var UserView = new Vue({
    el: '#user',
    data: {
        shared: store.state,
        loginEmail: '',
        loginPassword: '',
        displayRegistration: false
    },
    methods: userController
});


var RoomsView = new Vue({
    el: '#rooms',
    data: {
        shared: store.state,
        roomName: ''
    },
    methods: roomController
});
RoomsView.$watch('shared.user', function(val) {
    if(val !== undefined) {
        roomController.populateRooms(store.state);
    }
});

var ChatView = new Vue({
    el: '#chatroom',
    data: {
        shared: store.state
    },
    methods: chatController
});


var App = new Vue({
    el: '#app',
    data: {
        shared: store.state
    },
});