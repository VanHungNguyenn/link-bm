const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

function auth(req, res, next) {
	const token = req.header('zi-token');
	
	// Check for token
	if (!token) {
		return res.status(401).json({ status: 401, msg: 'No token, authorizaton denied' });
	}
	
	try {
		// Verify token
		const decoded = jwt.verify(token, config.get('jwtSecret'));
		// Add user from payload
		req.user = decoded;
		var name = req.user.name;
		
		User.findOne({name})
			.then(user => {
				if (!user) {
					return res.status(400).json({ msg: 'Tài khoản này không tồn tại' });
				}
				if (JSON.stringify(decoded.date).toString() == JSON.stringify(user.date).toString()) {
					next();
				} else {
					return res.status(400).json({ msg: 'Token hết hạn!' });
				}
			});
	} catch(e) {
		res.status(400).json({ status: 400, msg: 'Token is not valid' });
	}
}

module.exports = auth;