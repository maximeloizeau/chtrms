'use strict';

const chatroomController = require('../controllers/chatroom');

module.exports = function() {
    return [
        {
            method: 'POST',
            path: '/api/rooms',
            config: {
                handler: chatroomController.create
            }
        },
        {
            method: 'GET',
            path: '/api/rooms',
            config: {
                handler: chatroomController.getAll
            }
        }
    ];
}();
