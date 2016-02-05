'use strict';

const Path = require('path');
const Hapi = require('hapi');
const mongoose = require('mongoose');

const config = require('./config/app');
const authMiddleware = require('./middlewares/auth');
const socketMessagesController = require('./controllers/socket_message.js');
const routes = require('./routes')

// Create a server with a host and port
const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    }
});
server.connection({ 
    host: config.host, 
    port: config.port 
});
server.register(require('inert'), (err) => {
    if(err) {
        throw err;
    }

    // Register all routes defined in ./routes/
    for (var route in routes) {
        server.route(routes[route]);
    }
});


// Socket io initialization
const io = require('socket.io')(server.listener);

var endpoint = io.on('connection', function (socket) {
    socketMessagesController.setup(endpoint, socket);
});

// Database connection with mongoose
mongoose.connect('mongodb://localhost/herochat');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to MongoDB herochat");
});

// Log every request
server.on('response', function (request) {
    console.log(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.url.path + ' --> ' + request.response.statusCode);
});

// Middleware to check authentication (if token provided by client)
server.ext('onRequest', function (request, reply) {
    request.app.io = io;

    if(!request.headers.token) {
        request.app.authenticated = false;
        return reply.continue();
    }

    authMiddleware.loggedUser(request.headers.token, (authenticated, user) => {
        request.app.authenticated = authenticated;

        if(authenticated) {
            request.app.user = user;
        }

        return reply.continue();
    });
});

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});