var request = require('browser-request');

function login(event) {
	var self = this;

	request({
		method:'POST',
		url:'/api/login',
		json: {
			email: this.loginUsername,
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
	}
}

module.exports = {
	login: login,
	logout: logout
};