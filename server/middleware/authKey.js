require('dotenv').config()

const authKey = (req, res, next) => {
	try {
		const { key } = req.query

		if (key === process.env.SECRET_KEY) {
			next()
		} else {
			res.status(400).json({ msg: 'Invalid Authentication' })
		}
	} catch (error) {
		return res.status(500).json({ msg: error.message })
	}
}

module.exports = authKey
