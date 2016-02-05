'use strict';

const Boom = require('boom');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const config = require('../config/app');
const User = require('../models/user');

let cryptPassword = function(password) {
    return crypto.createHash('sha256').update(password + config.secret).digest('hex');
}

let loginFailed = function(reply) {
    return reply(Boom.unauthorized('Login failed'));
}

let logUserIn = function(email, hash, reply) {
    User.findOne({ 'email': email, 'password': hash })
    .then(user => {
        if(user) {
            // Expiration period in days
            const expirationPeriod = 30;
            let token = jwt.sign({ email: email }, config.secret, { expiresIn: expirationPeriod + 'd' });

            user.token = token;
            user.tokenExpiry = new Date(Date.now() + 60 * 60 * 24 * 30);
            user.save()
            .then(
                savedUser => {
                    return reply(savedUser.formatWithToken());
                },
                err => {
                    console.log("OK");
                    return loginFailed(reply);
                }
            );
        }
        else {
            return loginFailed(reply);
        }
    }, err => {
        return loginFailed(reply);
    });
}

module.exports = {
    
    login: function(request, reply) {
        const email = request.payload.email;
        const password = cryptPassword(request.payload.password);

        return logUserIn(email, password, reply);
    },

    signup: function(request, reply) {
        const username = request.payload.username;
        const email = request.payload.email;
        const password = cryptPassword(request.payload.password);
        
        User.findOne({ 'email': email })
        .then(user => {
            if(user) {
                return reply(Boom.badRequest('Email already in use'));
            }
            else {
                let createdUser = new User({
                    username: username,
                    email: email,
                    password: password
                });
                
                createdUser.save()
                .then(
                    savedUser => {
                        logUserIn(email, password, reply);
                    },
                    err => {
                        reply(Boom.badRequest('A problem occured during registration'));
                    }
                );
            }
        });
    },

    logout: function(request, reply) {
        if(request.app.user) {
            request.app.user.token = undefined;
            request.app.user.save()
            .then(u => {
                reply();
            });
        }
    }

};