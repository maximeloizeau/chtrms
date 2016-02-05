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

            console.log(self);
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

    /*socket.on('connection', function(s){
        console.log("Connected", s, s === socket);
    });*/
    socket.on('message', function(data) {
        if(data && data.text) {
            self.shared.messages.push(data);
        }
    });
    socket.emit('join', { roomName: roomName, token: self.shared.user.token });
}

module.exports = {
    createRoom: create,
    populateRooms: populateRooms,
    joinRoom: join
};