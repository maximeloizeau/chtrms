var request = require('browser-request');

function create(event) {
    var self = this;

    request({
        method:'POST',
        url:'/api/rooms',
        headers: {
            'Token': this.shared.user.token
        },
        json: {
            name: this.roomName
        }
    }, checkResponse);

    function checkResponse(err, response) {
        if(err) {
            return;
        }

        // If we don't have an active connection, we add the room ourselves
        if(!self.shared.socket) {
            self.shared.rooms.push({ name: self.roomName});
        }

        self.roomName = '';
    }
}

function populateRooms(store) {
    var storeObject = store || this.shared;

    request({
        method:'GET',
        url:'/api/rooms',
        headers: {
            'Token': storeObject.user.token
        },
        json: true
    }, checkResponse);

    function checkResponse(err, response) {
        if(err) {
            return;
        }

        var data = response.body;
        if(data) {
            storeObject.rooms = data;
        }
    }
}

function join(roomName) {
    var self = this;

    if(this.shared.socket) {
        this.shared.socket.disconnect();
    }

    var socket = io();
    this.shared.socket = socket;
    this.shared.room = roomName;

    socket.on('message', function(data) {
        if(data && data.text) {
            self.shared.messages.push(data);
        }
    });

    socket.on('new room', function(data) {
        if(data && data.name) {
            self.shared.rooms.push(data);
        }
    });

    socket.emit('join', { roomName: roomName, token: self.shared.user.token });

    populateMessages.call(self, roomName);
}

function populateMessages(roomName) {
    var self = this;

    request({
        method:'GET',
        url:'/api/rooms/' + roomName + '/messages',
        headers: {
            'Token': self.shared.user.token
        },
        json: true
    }, checkResponse);

    function checkResponse(err, response) {
        if(err) {
            return;
        }

        var data = response.body;
        if(data) {
            self.shared.messages = data;
        }
    }
}

module.exports = {
    createRoom: create,
    populateRooms: populateRooms,
    joinRoom: join
};