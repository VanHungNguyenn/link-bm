const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema MuaSanPhamLoi
const MuaSanPhamLoiSchema = new Schema({
	id_user: {
		type: String,
		default: null,
	},
	data: {
		type: Object,
		default: null,
	},
	status: {
		type: Number,
		default: 0,
	},
	msg: {
		type: Object,
		default: null,
	},
	date: {
		type: Date,
		default: Date.now,
	},
})

module.exports = MuaSanPhamLoi = mongoose.model(
	'MuaSanPhamLoi',
	MuaSanPhamLoiSchema
)
