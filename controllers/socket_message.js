'use strict';

const Boom = require('boom');

const config = require('../config/app');
const auth = require('../middlewares/auth');
const User = require('../models/user');
const ChatRoom = require('../models/chatroom');

function setup(endpoint, socket) {
    socket.on('message', messageReceived.bind(null, endpoint, socket));
}

function messageReceived(endpoint, socket, message) {
    if(!message && (!message.token || !message.text)) {
        // TODO return error message to user
        return;
    }

    auth.loggedUser(message.token, processMessage);

    function processMessage(userLoggedIn, user) {
        if(!userLoggedIn) return;

        endpoint.emit('message', message);
    }
}

module.exports = {
    setup: setup
};