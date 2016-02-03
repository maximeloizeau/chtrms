'use strict';

const mongoose = require('mongoose');

let messageSchema = mongoose.Schema({
	creationDate: 	Date,
	_user: 			mongoose.Schema.Types.ObjectId,
	_chatroom: 		mongoose.Schema.Types.ObjectId
});

let Message = mongoose.model('Message', messageSchema);

module.exports = Message;