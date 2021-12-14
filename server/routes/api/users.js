const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
var suid = require('rand-token').suid;
// User Model
const User = require('../../models/User');

// @route POST api/users
// @desc Register new user
// @access Public
router.post('/', (req, res) => {
	var { name, phone, password, repeatpassword } = req.body;
	
	// Simple validation
	name = name.replace(/ /g,'').toLowerCase();
	var match_username = name.match(/[^a-z0-9]+/g);
	if (match_username !== null) {
		return res.status(400).json({ msg: "Tên tài khoản không được có viết hoa, viết có dấu!" });
	}
	if (name.length > 50 || password.length > 50 || repeatpassword.length > 50 || phone.length > 50) {
		return res.status(400).json({ msg: "1 trường không được phép điền quá 50 kí tự!" });
	}
	if (!name || !phone || !password || !repeatpassword) {
		return res.status(400).json({ msg: 'Vui lòng điền đầy đủ' });
	}
	if (password !== repeatpassword) {
		return res.status(400).json({ msg: 'Kiểm tra lại mật khẩu' });
	}
	// Check for existing user
	User.findOne({name})
		.then(user => {
			if (user) {
				return res.status(400).json({ msg: 'User already exists' });
			}
			
			const newUser = new User({
				name,
				phone,
				password,
				stt:0,
				token: suid(16),
				role: 2,
				balance: 0
			});
			
			// Create salt & hash
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if (err) throw err;
					newUser.password = hash;
					User.find()
						.limit(1)
						.sort({ date: -1 })
						.then((item)=>{
							if (item.length > 0) {
								var sothutu = parseInt(item[0].stt);
								if (sothutu >= 100) {
									newUser.stt = sothutu+1;
								} else if((sothutu+1) >= 10 && (sothutu+1) < 100){
									newUser.stt = '0'+(sothutu+1);
								} else {
									newUser.stt = '00'+(sothutu+1);
								}
							} else {
								newUser.stt = '001';
							}
							newUser.save()
								.then(user => {
									jwt.sign(
										{ id: user.id, name: user.name, date: user.date, role: user.role },
										config.get('jwtSecret'),
										{ expiresIn: 31556926 },
										(err, token) => {
											if (err) throw err;
											res.json({
												token,
												user: {
													id: user.id,
													name: user.name,
													id_fb: user.id_fb,
													stt: user.stt,
													phone: user.phone,
													token: user.token,
													balance: user.balance,
													data: user.data,
													date: user.date,
												}
											});
										}
									)
								});
						})
				});
			});
		})
});

module.exports = router;