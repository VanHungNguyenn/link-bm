const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')

const listUser = require('../../../models/User')

router.post('/mua', auth, (req, res) => {
	let {
		_id,
		type,
		balance,
		ten_goi,
		money,
		limit_nhom,
		limit_vip,
		limit_fanpage,
		limit_account,
	} = req.body

	var date_now = Math.round(Date.now() / 1000)
	var date = date_now + 30 * 60 * 60 * 24
	var value = parseInt(balance) - parseInt(money)
	var inc30day = 30 * 60 * 60 * 24
	var data_goi_user = {
		loai: type,
		goi: ten_goi,
		date_add: date_now,
		date_expire: date,
	}
	if (typeof limit_nhom !== 'undefined') {
		data_goi_user = {
			...data_goi_user,
			limit_nhom: limit_nhom,
		}
	}
	if (typeof limit_vip !== 'undefined') {
		data_goi_user = {
			...data_goi_user,
			limit_vip: limit_vip,
		}
	}
	if (typeof limit_fanpage !== 'undefined') {
		data_goi_user = {
			...data_goi_user,
			limit_fanpage: limit_fanpage,
		}
	}
	if (typeof limit_account !== 'undefined') {
		data_goi_user = {
			...data_goi_user,
			limit_account: limit_account,
		}
	}
	if (value >= 0) {
		listUser
			.countDocuments({
				_id: _id,
				data: {
					$elemMatch: {
						loai: type,
						goi: ten_goi,
					},
				},
			})
			.then(function (res_exist_goi) {
				if (res_exist_goi <= 0) {
					listUser
						.findOneAndUpdate(
							{ _id: _id },
							{
								$pull: {
									data: {
										loai: type,
									},
								},
							}
						)
						.then(function (banggia_1) {
							listUser
								.findOneAndUpdate(
									{ _id: _id },
									{
										$set: {
											balance: value,
										},
										$push: {
											data: data_goi_user,
										},
									}
								)
								.then(function (banggia_2) {
									res.json({
										status: '200',
										msg:
											'Mua <strong>' +
											ten_goi +
											'</strong> thành công',
									})
								})
						})
				} else {
					listUser
						.findOneAndUpdate(
							{ _id: _id },
							{
								$set: {
									balance: value,
								},
								$inc: {
									'data.$[elem].date_expire': inc30day,
								},
							},
							{ arrayFilters: [{ 'elem.loai': type }] }
						)
						.then(function (banggia) {
							res.json({
								status: '200',
								msg:
									'Gia hạn <strong>' +
									ten_goi +
									'</strong> thành công',
							})
						})
				}
			})
	} else {
		res.json({
			status: '400',
			msg: 'Số dư không đủ để mua <strong>' + ten_goi + '</strong>',
		})
	}
})

module.exports = router

// Không có tác dụng
