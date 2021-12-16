var axios = require('axios')
var request = require('request')
var fs = require('fs')
const { base64encode, base64decode } = require('nodejs-base64')
const User = require('../../models/User')
const MuaSanPham = require('../../models/muasanpham')
const Product = require('../../models/product')
const getBank = () => {
	new Promise((resolve, reject) => {
		MuaSanPham.find({ status: { $in: 0 } })
			.sort({ date: 1 })
			.limit(1)
			.then((items) => {
				if (items.length > 0) {
					xulySanPham(items[0].data, items[0]._id)
				} else {
					setTimeout(function () {
						getBank()
					}, 5000)
				}
			})
			.catch((err) => {
				console.log(err)
			})
	})
}

function xulySanPham(body, id_giaodich) {
	User.find({ _id: body.id_user })
		.sort({ date: -1 })
		.limit(parseInt(body.sl))
		.then((items) => {
			var price_buy = Math.abs(parseInt(body.price_buy))
			var sl = Math.abs(parseInt(body.sl))

			var tientong = Math.abs(price_buy * sl)
			var balance = Math.abs(body.price_buy * sl)
			var tongtienmua = Math.abs(price_buy * sl)
			var data = {
				sell: 1,
				id_user_buy: body.id_user,
				date_sell: body.date_buy,
				name_user: body.user_name,
			}
			if (items.length > 0) {
				balance = Math.abs(parseInt(items[0].balance) - price_buy * sl)
				tongtienmua = Math.abs(
					parseInt(items[0].tongtienmua) + price_buy * sl
				)
				if (tientong > parseInt(items[0].balance)) {
					var result = {
						status: 400,
						msg: 'Không đủ tiền để mua sản phẩm',
					}
					updateActionBuy(id_giaodich, result, 1)
					return false
				}
				Product.find({
					id_loaisp: body.id_category,
					sell: 0,
					status: 1,
				})
					.sort({ date: 1 })
					.limit(body.sl)
					.then(async (product) => {
						if (product.length >= parseInt(body.sl)) {
							var checkpoint = 0
							for (var i = 0; i < product.length; i++) {
								checkpoint = await checkUID(
									product[i].data.split('|')[0]
								)
								if (checkpoint == 1) {
									var query = { _id: product[i]._id }
									Product.findOneAndUpdate(
										query,
										{ status: 2 },
										{ upsert: true },
										function (err, doc) {}
									)
									xulySanPham(body, id_giaodich)
									return false
								}
							}
							var ids = []
							product.forEach(function (value, index) {
								ids.push(value._id)
							})
							Product.updateMany(
								{ _id: { $in: ids } },
								data,
								{ upsert: true },
								function (err, doc) {
									User.updateMany(
										{ _id: body.id_user },
										{
											balance: balance,
											tongtienmua: tongtienmua,
										},
										{ upsert: true },
										function (err, doc) {
											const newLogs = new Logs({
												id_user: body.id_user,
												user_name: body.user_name,
												soluongmua: parseInt(body.sl),
												id_loaisanpham:
													body.id_category,
												name_category:
													body.name_category,
												description_category:
													body.description_category,
												price_buy: tientong,
												id_sanpham: ids,
											})
											newLogs.save().then((setting) => {
												var result = {
													status: 200,
													msg: 'Mua sản phẩm thành công',
												}
												updateActionBuy(
													id_giaodich,
													result,
													1
												)
												return false
											})
										}
									)
								}
							)
						} else {
							var result = {
								status: 400,
								msg: 'Hết tài khoản live!',
							}
							updateActionBuy(id_giaodich, result, 1)
							return false
						}
					})
			} else {
				var result = {
					status: 400,
					msg: 'Có lỗi xảy ra khi mua sản phẩm thành công',
				}
				updateActionBuy(id_giaodich, result, 1)
				return false
			}
		})
}

function updateActionBuy(id_giaodich, msg, status) {
	console.log(id_giaodich)
	var query = { _id: id_giaodich }
	var data = {
		status: status,
		msg: msg,
	}
	MuaSanPham.findOneAndUpdate(
		query,
		data,
		{ upsert: true },
		function (err, doc) {
			getBank()
		}
	)
}

function checkUID(uid = '') {
	var options2 = {
		method: 'GET',
		url: 'https://graph.fb.me/' + uid + '/picture?redirect=false',
	}
	return new Promise((resolve, reject) => {
		request(options2, function (error, response, body) {
			if (error) {
				resolve(1)
			} else {
				try {
					if (typeof JSON.parse(body).data.height !== 'undefined') {
						resolve(0)
					} else {
						resolve(1)
					}
				} catch (e) {
					resolve(1)
				}
			}
		})
	})
}
module.exports = getBank
