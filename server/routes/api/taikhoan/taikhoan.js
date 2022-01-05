const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')

const listUser = require('../../../models/User')

const SecretToken = require('../../../models/secret_token')
const jwt = require('jsonwebtoken')
const config = require('config')

router.get('/', auth, (req, res) => {
	listUser
		.findById(req.user.id)
		.then((useradmin) => {
			if (useradmin.role === 1) {
				listUser
					.find({ role: 2 })
					.sort({ date: -1 })
					.then((user) => res.json(user))
					.catch(function (error) {
						res.send({ error: 400, msg: 'Có lỗi xảy ra' })
					})
			}
		})
		.catch(function (error) {
			res.send({ error: 400, msg: 'Có lỗi xảy ra' })
		})
})

router.post('/edit', auth, (req, res) => {
	listUser
		.findById(req.user.id)
		.then((useradmin) => {
			if (useradmin.role === 1) {
				var { _id, thembot, thembot_value } = req.body
				// console.log('zzzzzzzzz');
				// var value = parseInt(balance);
				// var tiennap = parseInt(tongtiennap);
				// if (thembot == '+') {
				// value = parseInt(balance) + parseInt(thembot_value);
				// tiennap =parseInt(tongtiennap) + parseInt(thembot_value);
				// }
				// if (thembot == '-') {
				// value = parseInt(balance) - parseInt(thembot_value);
				// tiennap =parseInt(tongtiennap) - parseInt(thembot_value);
				// }
				var new_value = Math.abs(thembot_value)
				var new_value_total = Math.abs(thembot_value)
				if (thembot == '-') {
					new_value = new_value * -1
					new_value_total = 0
				}
				listUser
					.findOneAndUpdate(
						{ _id: _id },
						{
							$inc: {
								balance: parseInt(new_value),
								tongtiennap: parseInt(new_value_total),
							},
						}
					)
					.then(function (vip) {
						if (thembot == '+') {
							const newLichSuNapTien = new LichSuNapTien({
								id_user: vip.id,
								name_user: vip.name,
								ma_nap: '',
								noidung: 'Nạp tiền tay',
								tien_nap: parseInt(new_value),
							})
							newLichSuNapTien.save().then((setting) => {
								return res.send({
									status: 200,
									msg: 'Sửa tiền dư thành công!',
								})
							})
						} else {
							return res.send({
								status: 200,
								msg: 'Sửa tiền dư thành công!',
							})
						}
					})
					.catch(function (error) {
						// console.log(error);
						res.send({ status: 500, msg: 'Có lỗi xảy ra' })
					})
			} else {
				res.send({ status: 400, msg: 'Không phải tài khoản admin!' })
			}
		})
		.catch(function (error) {
			res.send({ status: 400, msg: 'Có lỗi xảy ra' })
		})
})

router.post('/createtoken', auth, async (req, res) => {
	try {
		const { secretString } = req.body
		const token = createToken(secretString)

		await SecretToken.findOneAndUpdate(
			{
				_id: '61c06156d8958d4988c622e1',
			},
			token
		)

		res.json({ msg: 'Token has been created', token: token })
	} catch (err) {
		return res.status(500).json({ msg: err.message })
	}
})

const createToken = (payload) => {
	return jwt.sign(payload, config.get('jwtSecret'))
}

module.exports = router
