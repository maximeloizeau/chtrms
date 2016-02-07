var request = require('browser-request');

function login(event) {
	var self = this;

	request({
		method:'POST',
		url:'/api/login',
		json: {
			email: this.loginEmail,
			password: this.loginPassword
		}
	}, checkLogin);

	function checkLogin(err, response) {
		if(err) {
			console.err(err);
			return;
		}

		var data = response.body;
		if(data && data.token) {
			self.shared.user = data;
		}
	}


	this.loginEmail = '';
	this.loginPassword = '';
}

function openRegistration(event) {
	this.displayRegistration = true;
}

function register(event) {
	var self = this;

	request({
		method:'POST',
		url:'/api/users',
		json: {
			email: this.registerEmail,
			username: this.registerUsername,
			password: this.registerPassword
		}
	}, checkRegistration);

	function checkRegistration(err, response) {
		if(err) {
			console.err(err);
			return;
		}

		var data = response.body;
		if(data && data.token) {
			self.displayRegistration = false;
			self.shared.user = data;
		}
	}

	this.registerEmail = '';
	this.registerUsername = '';
	this.registerPassword = '';
}

function logout(event) {
	var model = this.shared;

	request({
		method:'POST',
		url:'/api/logout',
		headers: {
			'Token': model.user.token
		}
	}, checkResponse);

	function checkResponse(err, response) {
		if(err) {
			return;
		}

		model.user = undefined;
		model.socket.disconnect();
		model.rooms = [];
		model.room = undefined;
		model.messages = [];
	}
}

module.exports = {
	login: login,
	logout: logout,
	openRegistration: openRegistration,
	register: register
};