const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const VipSchema = new Schema({
	id_user: {
		type: String,
	},
	uid: {
		type: String,
	},
	name: {
		type: String,
	},
	id_group: {
		type: String,
	},
	name_group: {
		type: String,
	},
	cauhinh: {
		type: Object,
	},
	date_add: {
		type: Date,
		default: Date.now
	},
	date_expire: {
		type: Date,
	},
});

module.exports = listVip = mongoose.model('list_vip', VipSchema);