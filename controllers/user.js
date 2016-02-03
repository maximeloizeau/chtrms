'use strict';

const Boom = require('boom');

const config = require('../config/app');
const User = require('../models/user');

module.exports = {
    
    me: function(request, reply) {
        if(!request.app.authenticated) {
            return reply(Boom.unauthorized());
        }

        reply(
            request.app.user.format()
        );
    },

    get: function(request, reply) {
        if(!request.app.authenticated) {
            return reply(Boom.unauthorized());
        }

        let requestedId = request.params.userId;
        if(!requestedId) {
            return reply(Boom.badData());
        }

        User
        .findById(requestedId)
        .then(user => {
            return reply(user.format());
        }, err => {
            return reply(Boom.notFound());
        });
    } 

};