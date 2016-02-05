'use strict';

const mongoose = require('mongoose');

let messageSchema = mongoose.Schema({
	creationDate: 	Date,
	text: 			String,
	_user: 			{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	_chatroom: 		mongoose.Schema.Types.ObjectId
});

let Message = mongoose.model('Message', messageSchema);

module.exports = Message;