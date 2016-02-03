'use strict';

const mongoose = require('mongoose');

// User model
const safeAttributes = ['_id', 'username', 'email'];
let userSchema = mongoose.Schema({
	username: String,
	email:     String,
	password:  String,
	token:     String,
	tokenExpiry: Date
});


userSchema.methods.formatWithToken = function() {
	let safeFields = safeAttributes.concat(['token', 'tokenExpiry']);
	return this.format(safeFields);
};

userSchema.methods.format = function(fields) {
	let safeFields = fields || safeAttributes;

	let safeUser = {};
	safeFields.forEach(a => {
		safeUser[a] = this[a];
	});

	return safeUser;
};

let User = mongoose.model('User', userSchema);

module.exports = User;