const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const MuaSanPhamSchema = new Schema({
	id_user :{
		type: String,
		default: null
	},
	data: {
		type: Object,
		default: null
	},
	status :{
		type: Number,
		default: 0
	},
	msg: {
		type: Object,
		default: null
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = MuaSanPham = mongoose.model('MuaSanPham', MuaSanPhamSchema);