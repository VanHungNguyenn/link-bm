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
	},
	icon: {
		type: String,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	number_order: {
		type: Number,
		required: true,
		unique: true,
	},
})

module.exports = CategoryProduct = mongoose.model(
	'categoryproduct',
	CategoryProductSchema
)
