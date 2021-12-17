const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema LichSuNapTien
const LichSuNapTienSchema = new Schema({
	id_user: {
		type: String,
		default: null,
	},
	ma_nap: {
		type: String,
		default: null,
	},
	name_user: {
		type: String,
		default: null,
	},
	noidung: {
		type: String,
		default: null,
	},
	tien_nap: {
		type: Number,
		default: null,
	},
	seen: {
		type: Number,
		default: 0,
	},
	thoigian_nap: {
		type: Date,
		default: Date.now,
	},
})

module.exports = LichSuNapTien = mongoose.model(
	'lichsunaptien',
	LichSuNapTienSchema
)
