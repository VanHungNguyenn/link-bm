const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MomoAndBankInfoSchema = new Schema({
	title: {
		type: String,
		default: null,
	},
	account_bank: {
		type: String,
		default: null,
	},
	password_bank: {
		type: String,
		default: null,
	},
	api: {
		type: String,
		default: null,
	},
	number_phone: {
		type: String,
		default: null,
	},
	date_time: {
		type: Date,
		default: Date.now,
	},
})

module.exports = MomoAndBankInfo = mongoose.model(
	'momoAndBankInfo',
	MomoAndBankInfoSchema
)
