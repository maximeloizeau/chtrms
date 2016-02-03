function App() {

}

App.prototype.start = function() {
	this.socket = io();

	this.socket.on('message', this.newMessage.bind(this));
	this.socket.emit('message', { text: 'Hello you' });
}

App.prototype.newMessage = function(message) {
	console.log(message);
}