'use strict';

const Boom = require('boom');

const config = require('../config/app');
const User = require('../models/user');
const ChatRoom = require('../models/chatroom');

module.exports = {
    
    getAll: function(request, reply) {
        if(!request.app.authenticated) {
            return reply(Boom.unauthorized());
        }

        ChatRoom
        .find()
        .then(chatrooms => {
            let chatroomsSanitized = chatrooms.map(c => { return c.format(); });

            return reply(chatroomsSanitized);
        }, err => {
            return reply(Boom.badData());
        });
    },

    create: function(request, reply) {
        if(!request.app.authenticated) {
            return reply(Boom.unauthorized());
        }

        const name = request.payload.name;
        
        ChatRoom.findOne({ 'name': name })
        .then(chatroom => {
            if(chatroom) {
                return reply(Boom.badRequest('Name already taken'));
            }
            else {
                let createdRoom = new ChatRoom({
                    name: name,
                    _creator: request.app.user,
                    creationDate: new Date()
                });
                
                createdRoom.save()
                .then(
                    savedRoom => {
                        return reply(savedRoom);
                    },
                    err => {
                        return reply(Boom.badRequest('A problem occured during room creation'));
                    }
                );
            }
        });
    } 

};