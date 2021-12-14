const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	stt: {
		type: String,
		default: 0
	},
	id_fb: {
		type: String,
		default: null
	},
	password: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		default: null
	},
	role: {
		type: Number,
	},
	balance: {
		type: Number
	},
	tongtiennap: {
		type: Number,
		default: 0
	},
	tongtienmua: {
		type: String,
		default: 0
	},
	data: {
		type: Array
	},
	token: {
		type: String,
		required: true 
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = User = mongoose.model('user', UserSchema);