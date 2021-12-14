const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProductSchema = new Schema({
	id_fb: {
		type: String,
		default: null
	},
	id_loaisp: {
		type: String,
		required: true
	},
	sell: {
		type: Number,
		default: 0
	},
	id_user_buy: {
		type: String,
		default: null
	},
	name_user: {
		type: String,
		default: null
	},
	data: {
		type: String,
		default: null
	},
	date: {
		type: Date,
		default: Date.now
	},
	date_sell: {
		type: Number,
		default: null
	},
	status: {
		type: Number,
		default: 1
	}
});

module.exports = Product = mongoose.model('product', ProductSchema);