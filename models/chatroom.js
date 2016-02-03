'use strict';

const mongoose = require('mongoose');

const safeAttributes = ['_id', 'name'];
let chatroomSchema = mongoose.Schema({
	creationDate: 	Date,
	name: 			String,
	_creator:  	    mongoose.Schema.Types.ObjectId
});

chatroomSchema.methods.format = function(fields) {
	let safeFields = fields || safeAttributes;

	let safeObject = {};
	safeFields.forEach(a => {
		safeObject[a] = this[a];
	});

	return safeObject;
};

let ChatRoom = mongoose.model('ChatRoom', chatroomSchema);

module.exports = ChatRoom;