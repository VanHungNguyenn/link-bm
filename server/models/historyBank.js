const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema HistoryBank
const HistoryBankSchema = new Schema({
	id_transaction: {
		type: String,
		default: null,
	},
	id_user: {
		type: String,
		default: null,
	},
	name_user: {
		type: String,
		default: null,
	},
	depositMoney: {
		type: Number,
		default: null,
	},
	date_time: {
		type: Date,
		default: Date.now,
	},
	content: {
		type: String,
		default: null,
	},
})

module.exports = HistoryBank = mongoose.model('historyBank', HistoryBankSchema)
