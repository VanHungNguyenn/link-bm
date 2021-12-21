const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const config = require('config')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const auth = require('../../../middleware/auth')
const CryptoJS = require('crypto-js')

// User Model
const CategoryProduct = require('../../../models/category_product')
const Product = require('../../../models/product')
const LichSuNapTien = require('../../../models/lichsunaptien')
const Logs = require('../../../models/logs')
const Notifi = require('../../../models/notifi')
const User = require('../../../models/User')
const MuaSanPham = require('../../../models/muasanpham')
const MuaSanPhamLoi = require('../../../models/muasanphamloi')

var options = {
	iv: CryptoJS.enc.Hex.parse('00000000000000000000000000000000'),
	mode: CryptoJS.mode.CBC,
	padding: CryptoJS.pad.Pkcs7,
}
// xu ly product (query=daban or chuaban => Admin show account fb)
router.get('/product', auth, (req, res) => {
	try {
		User.findById(req.user.id)
			.then((useradmin) => {
				if (useradmin.role == 1) {
					var sql_listtype = {}
					if (req.query.listtype == 'chuaban') {
						sql_listtype = { sell: 0 }
					}
					if (req.query.listtype == 'daban') {
						sql_listtype = { sell: 1 }
					}
					Product.find(sql_listtype)
						.sort({ date: -1 })
						.then((product) => res.json(product))
				} else {
					res.send({
						status: 400,
						msg: 'Không phải tài khoản admin!',
					})
				}
			})
			.catch(function (error) {
				res.send({ error: 400, msg: 'Có lỗi xảy ra' })
			})
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})

router.get('/productclient', auth, (req, res) => {
	try {
		var sql_select = [
			'-_id',
			'-data',
			'-date_sell',
			'-id_user_buy',
			'-id_fb',
			'-sell',
			'-name_user',
		]
		var sql_find = { sell: { $in: 0 } }
		if (req.user.role == 1 && req.route.path.indexOf('/admin') > -1) {
			sql_select = [
				'-date_sell',
				'-id_user_buy',
				'-id_fb',
				'-sell',
				'-name_user',
			]
			sql_find = {}
		}
		Product.find(sql_find)
			.select(sql_select)
			.sort({ date: -1 })
			.then((product) => res.json(product))
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})

router.get('/productclientno', (req, res) => {
	try {
		var sql_select = [
			'-_id',
			'-data',
			'-date_sell',
			'-id_user_buy',
			'-id_fb',
			'-sell',
			'-name_user',
		]
		var sql_find = { sell: { $in: 0 } }
		Product.find(sql_find)
			.select(sql_select)
			.sort({ date: -1 })
			.then((product) => res.json(product))
	} catch (e) {
		console.log(e)
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})
// xu ly lich su nap tien
router.get('/thongtingiaodich', auth, (req, res) => {
	try {
		MuaSanPham.find({ id_user: req.user.id, status: 1 })
			.sort({ date: 1 })
			.limit(1)
			.then((items) => {
				if (items.length > 0) {
					var ids = []
					ids.push(items[0]._id)
					var newproduct = []
					if (items[0].msg.status == 400) {
						newproduct = [
							{
								id_user: items[0].id_user,
								data: items[0].data,
								status: items[0].status,
								msg: items[0].msg,
								date: items[0].date,
							},
						]
					}
					MuaSanPhamLoi.insertMany(newproduct).then((setting) => {
						MuaSanPham.deleteMany(
							{ _id: { $in: ids } },
							function (err, result) {
								if (err) {
									res.status(400).json({
										status: 400,
										msg: 'Đã có lỗi xảy ra',
									})
								}
							}
						)
					})
					res.json(items[0].msg)
				} else {
					res.status(400).json({
						status: 400,
						msg: 'Đã có lỗi xảy ra',
					})
				}
			})
			.catch((err) => {
				console.log(err)
				res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
			})
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})

// Add product
router.post('/addproduct', auth, (req, res) => {
	try {
		User.findById(req.user.id)
			.then((useradmin) => {
				if (useradmin.role == 1) {
					if (req.body.id_product === '') {
						var dulieu = req.body.data.split('\n')
						var newproduct = []
						dulieu.forEach(function (value, index) {
							var ac = value.split('|')
							var ba = {
								id_loaisp: req.body.id_loaisp,
								data: value,
								id_fb: ac[0],
							}
							newproduct.push(ba)
						})
						Product.insertMany(newproduct).then((setting) => {
							res.json({
								status: 200,
								msg: 'Thêm sản phẩm thành công',
							})
						})
					} else {
						const data = {
							id_fb: req.body.id_fb,
							data: req.body.data,
							id_loaisp: req.body.id_loaisp,
						}
						var query = { _id: req.body.id_product }
						Product.findOneAndUpdate(
							query,
							data,
							{ upsert: true },
							function (err, doc) {
								if (err) return res.send(500, { error: err })
								var result = {
									status: 200,
									msg: 'Lưu sản phẩm thành công',
								}
								return res.json(result)
							}
						)
					}
				} else {
					res.send({
						status: 400,
						msg: 'Không phải tài khoản admin!',
					})
				}
			})
			.catch(function (error) {
				res.send({ error: 400, msg: 'Có lỗi xảy ra' })
			})
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})

// Change status account
router.post('/editstatusproduct', auth, (req, res) => {
	try {
		if (!isNumber(req.body.status_product)) {
			return res.send({ error: 400, msg: 'Có lỗi xảy ra! #2' })
		}
		User.findById(req.user.id)
			.then((useradmin) => {
				if (useradmin.role == 1) {
					if (req.body.id_product === '') {
						res.send({ error: 400, msg: 'Có lỗi xảy ra #1' })
					} else {
						const data = {
							status: req.body.status_product,
						}
						var query = { _id: req.body.id_product }
						Product.findOneAndUpdate(
							query,
							data,
							{ upsert: true },
							function (err, doc) {
								if (err) return res.send(500, { error: err })
								var result = {
									status: 200,
									msg: 'Sửa trạng thái thành công',
								}
								return res.json(result)
							}
						)
					}
				} else {
					res.send({
						status: 400,
						msg: 'Không phải tài khoản admin!',
					})
				}
			})
			.catch(function (error) {
				res.send({ error: 400, msg: 'Có lỗi xảy ra' })
			})
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})

// Xóa account
router.post('/deleteproduct', auth, (req, res) => {
	try {
		User.findById(req.user.id)
			.then((useradmin) => {
				if (useradmin.role == 1) {
					Product.deleteMany(
						{ _id: { $in: req.body }, sell: 0 },
						function (err, result) {
							if (err) {
								res.status(404).json({
									status: 404,
									msg: 'Xóa sản phẩm không thành công',
								})
							} else {
								res.json({
									status: 200,
									msg: 'Xóa sản phẩm thành công',
								})
							}
						}
					)
				} else {
					res.send({
						status: 400,
						msg: 'Không phải tài khoản admin!',
					})
				}
			})
			.catch(function (error) {
				res.send({ error: 400, msg: 'Có lỗi xảy ra' })
			})
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})

router.post('/updateproduct', auth, (req, res) => {
	try {
		User.findById(req.user.id)
			.then((useradmin) => {
				if (useradmin.role == 1) {
					var query = { _id: req.body._id }
					Product.findOneAndUpdate(
						query,
						req.body,
						{ upsert: true },
						function (err, doc) {
							if (err) return res.send(500, { error: err })
							var result = {
								status: 200,
								msg: 'Cập nhật sản phẩm thành công',
							}
							return res.json(result)
						}
					)
				} else {
					res.send({
						status: 400,
						msg: 'Không phải tài khoản admin!',
					})
				}
			})
			.catch(function (error) {
				res.send({ error: 400, msg: 'Có lỗi xảy ra' })
			})
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})

router.post('/downloadproduct', auth, (req, res) => {
	try {
		var sql_find = {
			_id: { $in: req.body.ids },
			sell: 1,
			id_user_buy: req.user.id,
		}
		if (req.user.role == 1) {
			sql_find = { _id: { $in: req.body.ids }, sell: 1 }
		}
		Product.find(sql_find)
			.sort({ date: -1 })
			.then((product) => res.json(product))
	} catch (e) {
		console.log(e)
	}
})

// Xem sản phẩm => Lịch sử mua
router.post('/viewproduct', auth, (req, res) => {
	try {
		Product.find({ _id: { $in: req.body.ids }, id_user_buy: req.user.id })
			.sort({ date: -1 })
			.then((product) => res.json(product))
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})

router.post('/viewproductadmin', auth, (req, res) => {
	try {
		User.findById(req.user.id)
			.then((useradmin) => {
				if (useradmin.role == 1) {
					Product.find({ _id: { $in: req.body.ids } })
						.sort({ date: -1 })
						.then((product) => res.json(product))
				} else {
					res.send({
						status: 400,
						msg: 'Không phải tài khoản admin!',
					})
				}
			})
			.catch(function (error) {
				res.send({ error: 400, msg: 'Có lỗi xảy ra' })
			})
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})

router.post('/checklinkbm', auth, (req, res) => {
	axios({
		method: 'GET',
		url: req.body.linkbm,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'User-agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36',
		},
	})
		.then(function (response) {
			var matches = response.data.match(/\{\"businessID\":(.*?)}/)
			// console.log(matches);
			res.json({
				status: 200,
				msg: 'Check link BM thành công',
				data: JSON.parse(matches[0]),
			})
			res.send(matches)
		})
		.catch(function (error) {
			res.status(404).json({
				status: 404,
				msg: 'Không thể check link BM',
			})
		})
})

router.post('/checklinkbmstep', auth, (req, res) => {
	axios({
		method: 'GET',
		url: 'https://m.facebook.com/ajax/dtsg/?__ajax__=1&__a=1',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			cookie: req.body.cookie,
			'User-agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36',
		},
	})
		.then(function (response) {
			var data = response.data.replace('for (;;);', '')

			var fb_dtsg = JSON.parse(data).payload.token
			checklinkbmstep2(res, fb_dtsg, req.body.id_busi, req.body.cookie)
		})
		.catch(function (error) {
			console.log(error)

			res.status(404).json({
				status: 404,
				msg: 'Không thể check link BM 1',
			})
		})
})

function checklinkbmstep2(res, fb_dtsg, idbm, cookie) {
	axios({
		method: 'GET',
		url: 'https://business.facebook.com/business/should_show_fbnux/',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			cookie: cookie,
			'User-agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36',
		},
		params: {
			business_id: idbm,
			nux_id: 6106,
			__a: 1,
			fb_dtsg: fb_dtsg,
		},
	})
		.then(function (response) {
			var data = response.data.replace('for (;;);', '')
			var st1 = JSON.parse(data).payload.should_show_nux
			checklinkbmstep3(res, fb_dtsg, idbm, cookie, st1)
		})
		.catch(function (error) {
			console.log(error)
			res.status(404).json({
				status: 404,
				msg: 'Không thể check link BM',
			})
		})
}

function checklinkbmstep3(res, fb_dtsg, idbm, cookie, st1) {
	axios({
		method: 'GET',
		url: 'https://business.facebook.com/business/should_show_fbnux/',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			cookie: cookie,
			'User-agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36',
		},
		params: {
			business_id: idbm,
			nux_id: 6252,
			__a: 1,
			fb_dtsg: fb_dtsg,
		},
	})
		.then(function (response) {
			var data = response.data.replace('for (;;);', '')
			var st2 = JSON.parse(data).payload.should_show_nux
			checklinkbmstep4(res, fb_dtsg, idbm, cookie, st1, st2)
		})
		.catch(function (error) {
			res.status(404).json({
				status: 404,
				msg: 'Không thể check link BM',
			})
		})
}
function checklinkbmstep4(res, fb_dtsg, idbm, cookie, st1, st2) {
	axios({
		method: 'GET',
		url: 'https://business.facebook.com/business/should_show_fbnux/',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			cookie: cookie,
			'User-agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36',
		},
		params: {
			business_id: idbm,
			nux_id: 7364,
			__a: 1,
			fb_dtsg: fb_dtsg,
		},
	})
		.then(function (response) {
			var data = response.data.replace('for (;;);', '')
			var st3 = JSON.parse(data).payload.should_show_nux
			var result = {
				status: 200,
				msg: 'Hoàn thành lấy thông tin',
				data: {
					khongbiet: st2,
					camquangcao: st1,
					verimail: st3,
				},
			}
			res.json(result)
		})
		.catch(function (error) {
			res.status(404).json({
				status: 404,
				msg: 'Không thể check link BM',
			})
		})
}

router.post('/buyproductauto', (req, res) => {
	try {
		const { id_category, user_name, sl } = req.body

		CategoryProduct.findById(id_category)
			.sort({ date: -1 })
			.then((categoryProduct) => {
				console.log(categoryProduct)
				const price1product = categoryProduct.price
				const name_category = categoryProduct.name
				console.log(
					'price1product: ',
					price1product,
					'\nname_category: ',
					name_category
				)
				User.findOne({ name: user_name })
					.sort({ date: -1 })
					.then((client) => {
						console.log(client)
						const id_user = client._id
						const balance_user = client.balance
						console.log(
							'id_user: ',
							id_user,
							'\nbalance_user: ',
							balance_user
						)
					})
			})

		res.status(200).json({ msg: 'Success' })
	} catch (err) {
		res.status(500).json({ msg: err.message })
	}
})

router.post('/buyproduct', auth, (req, res) => {
	try {
		var decrypt = CryptoJS.AES.decrypt(
			{
				ciphertext: CryptoJS.enc.Base64.parse(req.body.params),
				salt: '',
			},
			CryptoJS.enc.Base64.parse('khongthehackduoc'),
			options
		).toString(CryptoJS.enc.Utf8)
		var body = JSON.parse(decrypt)
		CategoryProduct.findById(body.id_category)
			.sort({ date: -1 })
			.then((categoryproduct) => {
				if (
					categoryproduct.price != Math.abs(parseInt(body.price_buy))
				) {
					res.status(200).json({
						status: 400,
						msg: 'Tiền mua không đủ',
					})
					return false
				} else {
					var data = {
						sl: Math.abs(parseInt(body.sl)),
						id_user: req.user.id,
						id_category: categoryproduct._id,
						user_name: body.user_name,
						price: Math.abs(parseInt(body.price)),
						price_buy: Math.abs(parseInt(categoryproduct.price)),
						name_category: categoryproduct.name,
						tienmua: categoryproduct.price,
						description_category: categoryproduct.description,
						date_buy: Date.now(),
					}
					const newMuaSanPham = new MuaSanPham({
						id_user: req.user.id,
						data: body,
					})
					newMuaSanPham.save().then((setting) => {
						var result = {
							status: 200,
							msg: 'Chúng tôi đang xử lý giao dịch của bạn. Vui lòng chờ chúng tôi trong giây lát.',
						}
						return res.json(result)
					})
				}
			})
	} catch (e) {
		res.status(200).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})

// xu ly category product
// router.get('/categoryproduct', (req, res) => {
// try{
// CategoryProduct.find()
// .sort({ date: -1 })
// .then(async (categoryproduct) => {
// res.json(categoryproduct);
// })
// } catch(e){
// res.status(400).json({status: 400,msg:'Đã có lỗi xảy ra'});
// }
// });
router.get('/categoryproduct', (req, res) => {
	try {
		CategoryProduct.find()
			.sort({ date: -1 })
			.then(async (categoryproduct) => {
				var new_categoryproduct = []
				if (categoryproduct.length > 0) {
					var new_categoryproduct_tmp = {}
					for (var i = 0; i < categoryproduct.length; i++) {
						var sql_find = {
							sell: { $in: 0 }, // 0: chua ban, 1: da ban
							status: { $in: 1 },
							id_loaisp: { $in: categoryproduct[i]._id },
						}
						var live_count = 0
						await Product.countDocuments(sql_find).then(
							(count_product) => {
								live_count = count_product
							}
						)

						var sql_find = {
							sell: { $in: 1 },
							id_loaisp: { $in: categoryproduct[i]._id },
						}
						var sold_count = 0
						await Product.countDocuments(sql_find).then(
							(count_product) => {
								sold_count = count_product
							}
						)

						new_categoryproduct_tmp = {
							_id: categoryproduct[i]._id,
							name: categoryproduct[i].name,
							price: categoryproduct[i].price,
							description: categoryproduct[i].description,

							type: categoryproduct[i].type,
							country: categoryproduct[i].country,
							icon: categoryproduct[i].icon,

							date: categoryproduct[i].date,
							__v: categoryproduct[i].__v,
							live_count: live_count,
							sold_count: sold_count,
						}
						new_categoryproduct.push(new_categoryproduct_tmp)
					}
				}

				res.json(new_categoryproduct)
			})
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})

// Thêm category product mới
router.post('/addcategoryproduct', auth, (req, res) => {
	try {
		User.findById(req.user.id)
			.then((useradmin) => {
				if (useradmin.role == 1) {
					if (req.body.name == '' || req.body.name == null) {
						return res.send({
							error: 400,
							msg: 'Tên không được để trống!',
						})
					}
					if (req.body.price == '' || req.body.price == null) {
						return res.send({
							error: 400,
							msg: 'Giá không được để trống!',
						})
					}
					if (
						req.body.description == '' ||
						req.body.description == null
					) {
						return res.send({
							error: 400,
							msg: 'Mô tả không được để trống!',
						})
					}
					if (req.body.type == '' || req.body.type == null) {
						return res.send({
							error: 400,
							msg: 'Thể loại không được để trống!',
						})
					}

					if (req.body.country == '' || req.body.country == null) {
						return res.send({
							error: 400,
							msg: 'Quốc gia không được để trống!',
						})
					}

					if (req.body.icon == '' || req.body.icon == null) {
						return res.send({
							error: 400,
							msg: 'Icon không được để trống!',
						})
					}

					if (req.body.id_category === '') {
						const newCategoryProduct = new CategoryProduct({
							name: req.body.name,
							price: req.body.price,
							description: req.body.description,
							type: req.body.type,
							country: req.body.country,
							icon: req.body.icon,
						})
						newCategoryProduct.save().then((setting) => {
							res.json({
								status: 200,
								msg: 'Thêm loại sản phẩm thành công',
							})
						})
					} else {
						const data = {
							name: req.body.name,
							price: req.body.price,
							description: req.body.description,
							type: req.body.type,
							country: req.body.country,
							icon: req.body.icon,
						}
						var query = { _id: req.body.id_category }
						CategoryProduct.findOneAndUpdate(
							query,
							data,
							{ upsert: true },
							function (err, doc) {
								if (err) return res.send(500, { error: err })
								var result = {
									status: 200,
									msg: 'Lưu loại sản phẩm thành công',
								}
								return res.json(result)
							}
						)
					}
				} else {
					res.send({
						status: 400,
						msg: 'Không phải tài khoản admin!',
					})
				}
			})
			.catch(function (error) {
				res.send({ error: 400, msg: 'Có lỗi xảy ra' })
			})
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})

router.post('/deletecategoryproduct', auth, (req, res) => {
	try {
		User.findById(req.user.id)
			.then((useradmin) => {
				if (useradmin.role == 1) {
					CategoryProduct.deleteMany(
						{ _id: { $in: req.body } },
						function (err, result) {
							if (err) {
								res.status(404).json({
									status: 404,
									msg: 'Xóa loại sản phẩm không thành công',
								})
							} else {
								res.json({
									status: 200,
									msg: 'Xóa loại sản phẩm thành công',
								})
							}
						}
					)
				} else {
					res.send({
						status: 400,
						msg: 'Không phải tài khoản admin!',
					})
				}
			})
			.catch(function (error) {
				res.send({ error: 400, msg: 'Có lỗi xảy ra' })
			})
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})

router.post('/updatecategoryproduct', auth, (req, res) => {
	try {
		User.findById(req.user.id)
			.then((useradmin) => {
				if (useradmin.role == 1) {
					var query = { _id: req.body._id }
					CategoryProduct.findOneAndUpdate(
						query,
						req.body,
						{ upsert: true },
						function (err, doc) {
							if (err) return res.send(500, { error: err })
							var result = {
								status: 200,
								msg: 'Cập nhật loại sản phẩm thành công',
							}
							return res.json(result)
						}
					)
				} else {
					res.send({
						status: 400,
						msg: 'Không phải tài khoản admin!',
					})
				}
			})
			.catch(function (error) {
				res.send({ error: 400, msg: 'Có lỗi xảy ra' })
			})
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})

// xu ly lich su nap tien
router.get('/lichsunaptien', auth, (req, res) => {
	try {
		LichSuNapTien.find({ id_user: req.user.id })
			.sort({ thoigian_nap: -1 })
			.then((items) => res.json(items))
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})

router.get('/adminlichsunaptien', auth, (req, res) => {
	try {
		User.findById(req.user.id)
			.then((useradmin) => {
				if (useradmin.role == 1) {
					LichSuNapTien.find()
						.sort({ thoigian_nap: -1 })
						.then((items) => res.json(items))
				} else {
					res.send({
						status: 400,
						msg: 'Không phải tài khoản admin!',
					})
				}
			})
			.catch(function (error) {
				res.send({ error: 400, msg: 'Có lỗi xảy ra' })
			})
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})

router.get('/userlichsunaptien', (req, res) => {
	try {
		LichSuNapTien.find()
			.sort({ thoigian_nap: -1 })
			.then((items) => {
				const sliceItems = items.slice(0, 9)

				res.json(sliceItems)
			})
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})

router.post('/addlichsunaptien', auth, (req, res) => {
	try {
		User.findById(req.user.id)
			.then((useradmin) => {
				if (useradmin.role == 1) {
					const newLichSuNapTien = new LichSuNapTien({
						id_user: req.user.id,
						ma_nap: req.body.ma_nap,
						noidung: req.body.noidung,
						tien_nap: req.body.tien_nap,
					})
					newLichSuNapTien.save().then((setting) => {
						res.json({
							status: 200,
							msg: 'Thêm lịch sử nạp tiền thành công',
						})
					})
				} else {
					res.send({
						status: 400,
						msg: 'Không phải tài khoản admin!',
					})
				}
			})
			.catch(function (error) {
				res.send({ error: 400, msg: 'Có lỗi xảy ra' })
			})
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})

router.post('/deletelichsunaptien', auth, (req, res) => {
	try {
		User.findById(req.user.id)
			.then((useradmin) => {
				if (useradmin.role == 1) {
					LichSuNapTien.findById(req.body.id)
						.then((items) =>
							items.remove().then(() =>
								res.json({
									status: 200,
									msg: 'Xóa lịch sử nạp tiền thành công',
								})
							)
						)
						.catch((err) =>
							res.status(404).json({
								status: 404,
								msg: 'Xóa lịch sử nạp tiền không thành công',
							})
						)
				} else {
					res.send({
						status: 400,
						msg: 'Không phải tài khoản admin!',
					})
				}
			})
			.catch(function (error) {
				res.send({ error: 400, msg: 'Có lỗi xảy ra' })
			})
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})

router.post('/updatelichsunaptien', auth, (req, res) => {
	try {
		User.findById(req.user.id)
			.then((useradmin) => {
				if (useradmin.role == 1) {
					var query = { _id: req.body._id }
					CategoryProduct.findOneAndUpdate(
						query,
						req.body,
						{ upsert: true },
						function (err, doc) {
							if (err) return res.send(500, { error: err })
							var result = {
								status: 200,
								msg: 'Cập nhật lịch sử thành công',
							}
							return res.json(result)
						}
					)
				} else {
					res.send({
						status: 400,
						msg: 'Không phải tài khoản admin!',
					})
				}
			})
			.catch(function (error) {
				res.send({ error: 400, msg: 'Có lỗi xảy ra' })
			})
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})

router.get('/logs', auth, (req, res) => {
	try {
		Logs.find({ id_user: req.user.id })
			.sort({ ngaymua: -1 })
			.then((items) => res.json(items))
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})

router.get('/notifilogs', auth, (req, res) => {
	try {
		LichSuNapTien.find({ id_user: req.user.id, seen: { $in: 0 } })
			.limit(1)
			.sort({ thoigian_nap: -1 })
			.then((items) => {
				if (items.length > 0) {
					var query = { _id: items[0]._id }
					LichSuNapTien.findOneAndUpdate(
						query,
						{ seen: 1 },
						function (err, doc) {
							res.json({
								status: 200,
								msg: 'Lấy thông báo nạp tiền thành công!',
								data: items,
							})
						}
					)
				} else {
					res.status(400).json({
						status: 400,
						msg: 'Không có thông báo',
					})
				}
			})
			.catch((err) => {
				res.status(400).json({
					status: 400,
					msg: 'Lấy thông báo tiền không thành công',
				})
			})
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})

router.get('/adminlogs', auth, (req, res) => {
	try {
		User.findById(req.user.id)
			.then((useradmin) => {
				if (useradmin.role == 1) {
					Logs.find()
						.sort({ ngaymua: -1 })
						.then((items) => res.json(items))
				} else {
					res.send({
						status: 400,
						msg: 'Không phải tài khoản admin!',
					})
				}
			})
			.catch(function (error) {
				res.send({ error: 400, msg: 'Có lỗi xảy ra' })
			})
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})

// Get public history buy
router.get('/userlogs', (req, res) => {
	try {
		Logs.find()
			.sort({ ngaymua: -1 })
			.then((items) => {
				const sliceItems = items.slice(0, 9)

				res.json(sliceItems)
			})
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})

router.get('/admintongdoanhthu', auth, (req, res) => {
	try {
		User.findById(req.user.id)
			.then(async (useradmin) => {
				if (useradmin.role == 1) {
					var lichsunaptien = await LichSuNapTien.find()
						.sort({ thoigian_nap: -1 })
						.then((items) => items)
					var lichsumua = await Logs.find()
						.sort({ ngaymua: -1 })
						.then((items) => items)
					var arr = []
					arr.push({
						lichsunaptien: lichsunaptien,
						lichsumua: lichsumua,
					})
					res.json(arr)
				} else {
					res.send({
						status: 400,
						msg: 'Không phải tài khoản admin!',
					})
				}
			})
			.catch(function (error) {
				res.send({ error: 400, msg: 'Có lỗi xảy ra' })
			})
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})
router.post('/addlogs', auth, (req, res) => {
	try {
		User.findById(req.user.id)
			.then((useradmin) => {
				if (useradmin.role == 1) {
					const newLogs = new Logs({
						id_user: req.user.id,
						user_name: req.body.user_name,
						soluongmua: req.body.soluongmua,
						id_loasanpham: req.body.id_loasanpham,
					})
					newLogs.save().then((setting) => {
						res.json({
							status: 200,
							msg: 'Thêm lịch sử mua thành công',
						})
					})
				} else {
					res.send({
						status: 400,
						msg: 'Không phải tài khoản admin!',
					})
				}
			})
			.catch(function (error) {
				res.send({ error: 400, msg: 'Có lỗi xảy ra' })
			})
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})

router.post('/deletelogs', auth, (req, res) => {
	try {
		User.findById(req.user.id)
			.then((useradmin) => {
				if (useradmin.role == 1) {
					Logs.findById(req.body.id)
						.then((items) =>
							items.remove().then(() =>
								res.json({
									status: 200,
									msg: 'Xóa lịch sử mua thành công',
								})
							)
						)
						.catch((err) =>
							res.status(404).json({
								status: 404,
								msg: 'Xóa lịch sử mua không thành công',
							})
						)
				} else {
					res.send({
						status: 400,
						msg: 'Không phải tài khoản admin!',
					})
				}
			})
			.catch(function (error) {
				res.send({ error: 400, msg: 'Có lỗi xảy ra' })
			})
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})

router.post('/updatelogs', auth, (req, res) => {
	try {
		User.findById(req.user.id)
			.then((useradmin) => {
				if (useradmin.role == 1) {
					var query = { _id: req.body._id }
					Logs.findOneAndUpdate(
						query,
						req.body,
						{ upsert: true },
						function (err, doc) {
							if (err) return res.send(500, { error: err })
							var result = {
								status: 200,
								msg: 'Cập nhật lịch sử mua thành công',
							}
							return res.json(result)
						}
					)
				} else {
					res.send({
						status: 400,
						msg: 'Không phải tài khoản admin!',
					})
				}
			})
			.catch(function (error) {
				res.send({ error: 400, msg: 'Có lỗi xảy ra' })
			})
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})

// thongbao tu admin
router.get('/notifi', auth, (req, res) => {
	try {
		Notifi.find()
			.sort({ date: -1 })
			.then((items) => res.json(items))
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})
router.get('/notifidisplay', (req, res) => {
	try {
		Notifi.find()
			.limit(1)
			.sort({ date: -1 })
			.then((items) => {
				if (items.length > 0) {
					var data = {
						thongbao: items[0].thongbao,
						link_backup: items[0].link_backup,
						token_bm: items[0].token_bm,
						cookie_bm: items[0].cookie_bm,
						link_group_fb: items[0].link_group_fb,
						link_group_tele: items[0].link_group_tele,
						link_group_zalo: items[0].link_group_zalo,
					}
					res.json(data)
				} else {
					var data = {
						thongbao: '',
						link_backup: '',
						token_bm: '',
						cookie_bm: '',
						link_group_fb: '',
						link_group_tele: '',
						link_group_zalo: '',
					}
					res.json(data)
				}
			})
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})
router.post('/addnotifi', auth, (req, res) => {
	try {
		User.findById(req.user.id)
			.then((useradmin) => {
				if (useradmin.role == 1) {
					if (req.body._id !== '') {
						var query = { _id: req.body._id }
						Notifi.findOneAndUpdate(query, req.body, {
							upsert: true,
						})
							.then((item) => {
								res.json({
									status: 200,
									msg: 'Lưu thông báo thành công',
									data: item,
								})
							})
							.catch((err) => {
								console.log(req.body)
								res.status(404).json({
									status: 404,
									msg: 'Lưu thông báo không thành công',
								})
							})
					} else {
						const newNotifi = new Notifi({
							id_user: req.user.id,
							link_backup: req.body.link_backup,
							token_bm: req.body.token_bm,
							cookie_bm: req.body.cookie_bm,
							url_bank: req.body.url_bank,
							thongbao: req.body.thongbao,
							cookie_bank: req.body.cookie_bank,
							data_bank: req.body.data_bank,
							link_group_fb: req.body.link_group_fb,
							link_group_tele: req.body.link_group_tele,
							link_group_zalo: req.body.link_group_zalo,
						})
						newNotifi.save().then((item) => {
							res.json({
								status: 200,
								msg: 'Lưu thông báo thành công',
								data: item,
							})
						})
					}
				} else {
					res.send({
						status: 400,
						msg: 'Không phải tài khoản admin!',
					})
				}
			})
			.catch(function (error) {
				res.send({ error: 400, msg: 'Có lỗi xảy ra' })
			})
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})
router.post('/deletenotifi', auth, (req, res) => {
	try {
		User.findById(req.user.id)
			.then((useradmin) => {
				if (useradmin.role == 1) {
					Notifi.deleteMany(
						{ _id: { $in: req.body } },
						function (err, result) {
							if (err) {
								res.status(404).json({
									status: 404,
									msg: 'Xóa thông báo không thành công',
								})
							} else {
								res.json({
									status: 200,
									msg: 'Xóa thông báo thành công',
								})
							}
						}
					)
				} else {
					res.send({
						status: 400,
						msg: 'Không phải tài khoản admin!',
					})
				}
			})
			.catch(function (error) {
				res.send({ error: 400, msg: 'Có lỗi xảy ra' })
			})
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})

router.post('/gettotalmoney', auth, (req, res) => {
	try {
		var { date } = req.body
		date = date.split('-')
		if (date.length > 1) {
			User.findById(req.user.id)
				.then((useradmin) => {
					if (useradmin.role == 1) {
						LichSuNapTien.aggregate(
							[
								{
									$project: {
										month: { $month: '$thoigian_nap' },
										year: { $year: '$thoigian_nap' },
										tiennap: { $add: '$tien_nap' },
									},
								},
								{
									$match: {
										month: parseInt(date[0]),
										year: parseInt(date[1]),
									},
								},
							],
							function (err, doc) {
								if (err) return res.send(500, { error: err })

								var final_money = 0
								if (doc.length > 0) {
									doc.forEach(function (v, i) {
										final_money = final_money + v.tiennap
									})
								}
								var result = {
									status: 200,
									msg: 'Lấy tổng tiền tháng thành công!',
									data: final_money,
								}
								return res.json(result)
							}
						)
					} else {
						res.send({
							status: 400,
							msg: 'Không phải tài khoản admin!',
						})
					}
				})
				.catch(function (error) {
					res.send({ error: 400, msg: 'Có lỗi xảy ra' })
				})
		} else {
			res.send({ error: 400, msg: 'Có lỗi xảy ra #1' })
		}
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})

router.get('/getproductloi', auth, (req, res) => {
	try {
		User.findById(req.user.id)
			.then((useradmin) => {
				if (useradmin.role == 1) {
					MuaSanPhamLoi.find({})
						.sort({ date: -1 })
						.then((product) =>
							res.json({ status: 200, data: product })
						)
				} else {
					res.send({
						status: 400,
						msg: 'Không phải tài khoản admin!',
					})
				}
			})
			.catch(function (error) {
				res.send({ error: 400, msg: 'Có lỗi xảy ra' })
			})
	} catch (e) {
		res.status(400).json({ status: 400, msg: 'Đã có lỗi xảy ra' })
	}
})

function isNumber(n) {
	return !isNaN(parseFloat(n)) && !isNaN(n - 0)
}

module.exports = router
