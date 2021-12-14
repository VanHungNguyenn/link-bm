const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const NotifiSchema = new Schema({
	id_user: {
		type: String,
		default: null
	},
	thongbao: {
		type: String,
		default: null
	},
	url_bank:{
		type: String,
		default: null
	},
	cookie_bank: {
		type: String,
		default: null
	},
	cookie_bm: {
		type: String,
		default: null
	},
	token_bm: {
		type: String,
		default: null
	},
	link_backup: {
		type: String,
		default: null
	},
	data_bank: {
		type: String,
		default: null
	},
	link_group_fb: {
		type: String,
		default: null
	},
	link_group_zalo: {
		type: String,
		default: null
	},
	link_group_tele: {
		type: String,
		default: null
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = Notifi = mongoose.model('notifi', NotifiSchema);