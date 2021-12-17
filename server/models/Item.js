const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const ItemSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
})

// const Item = mongoose.model('item', userSchema);
// module.exports = Item;
module.exports = Item = mongoose.model('item', ItemSchema)

// Không có tác dụng
