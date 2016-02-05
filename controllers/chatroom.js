'use strict';

const Boom = require('boom');

const config = require('../config/app');
const User = require('../models/user');
const ChatRoom = require('../models/chatroom');
const Message = require('../models/message');

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
        
        ChatRoom
        .findOne({ 'name': name })
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
                        request.app.io.emit('new room', { name: savedRoom.name });
                        return reply(savedRoom);
                    },
                    err => {
                        return reply(Boom.badRequest('A problem occured during room creation'));
                    }
                );
            }
        });
    },

    getMessages: function(request, reply) {
        if(!request.app.authenticated) {
            return reply(Boom.unauthorized());
        }

        ChatRoom
        .findOne({ 'name': request.params.roomName })
        .then(chatroom => {
            if(!chatroom) {
                return reply(Boom.notFound());
            }

            Message
            .find({ '_chatroom': chatroom })
            .populate('_user')
            .sort({ 'creationDate': 'asc' })
            .limit(30)
            .then(messages => {
                console.log(messages);
                var formattedMessages = messages.map(m => {
                    return {
                        date: m.creationDate,
                        text: m.text,
                        user: m._user.username
                    }
                });

                reply(formattedMessages);
            }, err => {
                return reply(Boom.badData());
            });

        }, err => {
            return reply(Boom.badData());
        });
    }
};