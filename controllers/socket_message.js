'use strict';

const Boom = require('boom');

const config = require('../config/app');
const User = require('../models/user');
const ChatRoom = require('../models/chatroom');

module.exports = {
    setup: function(endpoint, socket) {
        socket.on('message', function(newMessage) {
            console.log(newMessage);
            endpoint.emit('message', newMessage);
        });
    }
};