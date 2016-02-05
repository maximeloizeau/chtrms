'use strict';

const Boom = require('boom');

const config = require('../config/app');
const auth = require('../middlewares/auth');
const User = require('../models/user');
const ChatRoom = require('../models/chatroom');

function setup(endpoint, socket) {
    socket.on('message', messageReceived.bind(null, endpoint, socket));
    socket.on('join', joiningRoom.bind(null, endpoint, socket));
}

function messageReceived(endpoint, socket, message) {
    if(!message || !message.token || !message.text) {
        // TODO return error message to user
        return;
    }

    auth.loggedUser(message.token, processMessage);

    function processMessage(userLoggedIn, user) {
        if(!userLoggedIn) return;

        endpoint.in(message.room).emit('message', { text: message.text, user: user.username, date: new Date() });
    }
}

function joiningRoom(endpoint, socket, data) {
    console.log("Joining", data);
    if(!data || !data.token || !data.roomName) {
        // TODO return error message to user
        return;
    }

    auth.loggedUser(data.token, processMessage);

    function processMessage(userLoggedIn, user) {
        if(!userLoggedIn) return;

        console.log("Room " + data.roomName);
        socket.join(data.roomName);
    }

}

module.exports = {
    setup: setup
};