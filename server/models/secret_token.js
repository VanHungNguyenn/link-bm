const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const secretTokenSchema = new Schema({
	token: {
		type: String,
		required: true,
	},
})

module.exports = SecretToken = mongoose.model('token', secretTokenSchema)
