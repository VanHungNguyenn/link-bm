const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const createKey = require('bcrypt')
const auth = require('../../middleware/auth')

// User Model
const User = require('../../models/User')

// @route 	POST api/auth
// @desc 	Auth user
// @access 	Public
router.post('/', (req, res) => {
	try {
		var { name, password } = req.body

		// Simple validation
		if (!name || !password) {
			return res
				.status(400)
				.json({ msg: 'Vui lòng nhập đầy đủ thông tin' })
		}
		name = name.toLowerCase()
		// Check for existing user
		User.findOne({ name }).then((user) => {
			if (!user) {
				return res
					.status(400)
					.json({ msg: 'Tài khoản này không tồn tại' })
			}

			// Validate password
			bcrypt.compare(password, user.password).then(async (isMatch) => {
				if (!isMatch)
					return res
						.status(400)
						.json({ msg: 'Tài khoản hoặc mật khẩu không đúng' })

				const nguoi_dung = await User.findOne({ name })
				if (!nguoi_dung.key) {
					const key = await createKey.hash(name, 12)
					await User.findOneAndUpdate({ name }, key)
				}

				jwt.sign(
					{
						id: user.id,
						name: user.name,
						date: user.date,
						role: user.role,
					},
					config.get('jwtSecret'),
					{ expiresIn: 3155692631556926 },
					(err, token) => {
						if (err) throw err

						res.json({
							token,
							user: {
								_id: user.id,
								role: user.role,
								name: user.name,
								stt: user.stt,
								phone: user.phone,
								balance: user.balance,
								data: user.data,
								date: user.date,
							},
						})
					}
				)
			})
		})
	} catch (e) {
		console.log(e)
	}
})

// @route 	GET api/auth/user
// @desc 	Get user data
// @access 	Private
router.get('/user', auth, (req, res) => {
	try {
		User.findById(req.user.id)
			.select(['-password'])
			.then((user) => res.json(user))
	} catch (e) {
		console.log(e)
	}
})

router.post('/delete', auth, (req, res) => {
	try {
		User.findById(req.user.id)
			.then((useradmin) => {
				if (useradmin.role == 1) {
					User.findById(req.body.id)
						.then((item) =>
							item.remove().then(() =>
								res.json({
									status: 200,
									msg: 'Xóa tài khoản thành công',
								})
							)
						)
						.catch((err) => {
							console.log(err)
							res.status(400).json({
								status: 400,
								msg: 'Xóa tài khoản không thành công',
							})
						})
				}
			})
			.catch(function (error) {
				res.send({ error: 400, msg: 'Có lỗi xảy ra' })
			})
	} catch (e) {
		console.log(e)
	}
})

router.post('/editpass', auth, (req, res) => {
	try {
		var date = new Date()
		User.findById(req.user.id)
			.then((useradmin) => {
				if (useradmin.role == 1) {
					// Create salt & hash
					const { id, password, repeatpassword } = req.body

					if (password !== repeatpassword) {
						return res.status(400).json({
							msg: 'Mật khẩu và nhập lại mật khẩu không trùng nhau',
						})
					}

					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(password, salt, (err, hash) => {
							if (err) throw err
							var query = { _id: id }
							var body = {
								password: hash,
								date: date,
							}
							User.findOneAndUpdate(
								query,
								body,
								{ upsert: true },
								function (err, doc) {
									if (err)
										return res.send(500, { error: err })
									res.status(200).json({
										//xxx
										status: 200,
										msg: 'Cập nhật mật khẩu thành công',
									})
								}
							)
						})
					})
				} else {
					res.send({ error: 400, msg: 'Bạn không phải là Admin!' })
				}
			})
			.catch(function (error) {
				res.send({ error: 400, msg: 'Có lỗi xảy ra' })
			})
	} catch (e) {
		console.log(e)
	}
})

router.post('/user_save_info', auth, (req, res) => {
	try {
		var { _id, phone, old_pass, new_pass, re_pass } = req.body.dataform
		phone = phone.trim()
		old_pass = old_pass.trim()
		new_pass = new_pass.trim()
		re_pass = re_pass.trim()

		var body = {}
		if (phone != '') {
			body['phone'] = phone
		}

		if (req.user.id == _id) {
			if (old_pass == '') {
				return res.send({
					error: 400,
					msg: 'Mật khẩu cũ không được để trống!',
				})
			}
			var date = new Date()
			User.findById(req.user.id)
				.then((user) => {
					// Create salt & hash
					bcrypt.compare(old_pass, user.password).then((isMatch) => {
						if (!isMatch)
							return res.send({
								error: 400,
								msg: 'Mật khẩu cũ không đúng!',
							})

						if (new_pass != '') {
							if (new_pass != re_pass) {
								return res.send({
									error: 400,
									msg: 'Mật khẩu nhập lại không khớp!',
								})
							}
						}

						bcrypt.genSalt(10, (err, salt) => {
							bcrypt.hash(new_pass, salt, (err, hash) => {
								if (err) throw err
								var query = { _id: _id }
								if (new_pass != '') {
									body['password'] = hash
								}
								body['date'] = date
								User.findOneAndUpdate(
									query,
									body,
									{ upsert: true },
									function (err, doc) {
										if (err)
											return res.send(500, { error: err })
										return res.json({
											status: 200,
											msg: 'Cập nhật mật khẩu thành công',
										})
									}
								)
							})
						})
					})
				})
				.catch(function (error) {
					return res.send({ error: 400, msg: 'Có lỗi xảy ra' })
				})
		} else {
			return res.send({
				error: 400,
				msg: 'Đây không phải là tài khoản của bạn!',
			})
		}
	} catch (e) {
		console.log(e)
	}
})

router.get('/userbytoken', auth, (req, res) => {
	try {
		User.findById(req.user.id)
			.then((useradmin) => {
				if (useradmin.role == 1) {
					console.log(req.query.token)

					User.find({ token: req.query.token }).then((user) => {
						if (user.length > 0) {
							var result = {
								status: 200,
								msg: 'Có dữ liệu',
								data: {
									user_id: user[0]._id,
								},
							}
							res.send(result)
						} else {
							var result = {
								status: 401,
								msg: 'không có dữ liệu',
								data: {},
							}
							res.send(result)
						}
					})
				}
			})
			.catch(function (error) {
				res.send({ error: 400, msg: 'Có lỗi xảy ra' })
			})
	} catch (e) {
		console.log(e)
	}
})

module.exports = router
