var request = require('browser-request');

function sendMessage(event) {
	if(!this.shared.socket) return;

	this.shared.socket.emit('message', { text: this.chatMessageText, token: this.shared.user.token, room: this.shared.room });
	this.chatMessageText = '';
}

module.exports = {
	sendMessage: sendMessage
};