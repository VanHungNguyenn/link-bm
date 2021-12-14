const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const CategoryProductSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	price: {
		type: Number,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
	country: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
})

module.exports = CategoryProduct = mongoose.model(
	'categoryproduct',
	CategoryProductSchema
)
