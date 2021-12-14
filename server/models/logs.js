const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const LogSchema = new Schema({
	id_user: {
		type: String,
		default: null
	},
	user_name: {
		type: String,
		default: null
	},
	soluongmua: {
		type: String,
		default: null
	},
	id_loaisanpham: {
		type: String,
		default: null
	},
	name_category: {
		type: String,
		default: null
	},
	description_category: {
		type: String,
		default: null
	},
	price_buy: {
		type: Number,
		default: 0
	},
	id_sanpham: {
		type: Array,
		default: []
	},
	ngaymua: {
		type: Date,
		default: Date.now
	}
});

module.exports = Logs = mongoose.model('Log', LogSchema);