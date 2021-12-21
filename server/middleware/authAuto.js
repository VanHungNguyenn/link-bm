const config = require('config')
const jwt = require('jsonwebtoken')

const authAuto = async (req, res, next) => {
	try {
		const secretToken = await req.header('Authorization')
		if (!secretToken) {
			return res.status(400).json({ msg: 'Invalid Authentication' })
		}

		jwt.verify(secretToken, config.get('jwtSecret'), (err, user) => {
			if (err)
				return res.status(400).json({ msg: 'Invalid Authentication' })

			next()
		})
	} catch (e) {
		return res.status(500).json({ msg: 'Token is not valid!' })
	}
}

module.exports = authAuto
