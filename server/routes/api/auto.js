const express = require('express')
const router = express.Router()
var request = require('request')
const authKey = require('../../middleware/authKey')
require('dotenv').config()

// User Model
const CategoryProduct = require('../../models/category_product')
const Product = require('../../models/product')
const User = require('../../models/User')

const checkUID = async (uid = '') => {
	try {
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
						if (
							typeof JSON.parse(body).data.height !== 'undefined'
						) {
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
	} catch (error) {
		return 1
	}
}

async function handleBuyProducts(id_category, user_name, sl, res) {
	try {
		if (typeof sl === 'undefined') {
			return {
				status: 400,
				result: { msg: 'Enter the amount you want to buy' },
			}
		}
		if (!Number.isInteger(Number(sl))) {
			return {
				status: 400,
				result: { msg: 'The quantity you purchased is not valid' },
			}
		}
		if (parseInt(sl) <= 0) {
			return {
				status: 400,
				result: { msg: 'The quantity you purchased is not valid' },
			}
		}

		let live_count = 0
		var sql_find = {
			sell: { $in: 0 }, // 0: chua ban, 1: da ban
			status: { $in: 1 },
			id_loaisp: { $in: id_category },
		}

		await Product.countDocuments(sql_find).then((count_product) => {
			live_count = count_product
		})

		if (live_count <= 0) {
			return {
				status: 400,
				result: { msg: 'Out of stock' },
			}
		}

		if (live_count < sl) {
			return {
				status: 400,
				result: { msg: 'Too many products available' },
			}
		}

		const categoryProduct = await CategoryProduct.findById(
			id_category
		).sort({ date: -1 })

		const price1product = categoryProduct.price
		const name_category = categoryProduct.name
		const description_category = categoryProduct.description
		const totalPrice = parseInt(sl) * price1product

		const client = await User.findOne({ name: user_name }).sort({
			date: -1,
		})

		const id_user = client._id
		const balance_user = client.balance
		const tongtienmua = client.tongtienmua

		if (balance_user < totalPrice) {
			return {
				status: 400,
				result: {
					msg: 'Account does not have enough money to buy',
				},
			}
		}

		const newBalance = balance_user - totalPrice
		const newTongtienmua = String(parseInt(tongtienmua) + totalPrice)

		// Data update when user buy
		var data = {
			sell: 1,
			id_user_buy: id_user,
			date_sell: Date.now(),
			name_user: user_name,
		}

		let products

		while (true) {
			products = await Product.find({
				id_loaisp: id_category,
				sell: 0,
				status: 1,
			})
				.sort({ date: 1 })
				.limit(Number(sl))

			if (products.length >= parseInt(sl)) {
				// Start handle checkpoint

				let checkPointTemp = 0

				for (var i = 0; i < products.length; i++) {
					let checkpoint = 0
					checkpoint = await checkUID(products[i].data.split('|')[0])

					if (checkpoint === 1) {
						var query = {
							_id: products[i]._id,
						}

						await Product.findOneAndUpdate(
							query,
							{ status: 2 },
							{ upsert: true }
						)
						checkPointTemp++
					}
				}

				if (checkPointTemp === 0) {
					break
				}
			} else {
				return {
					status: 400,
					result: {
						msg: 'Out of stock',
					},
				}
			}
		}

		// End handle checkpoint

		var ids = []

		products.forEach((value) => {
			ids.push(value._id)
		})

		let result = products

		// Cập nhật tên người mua vào sản phẩm
		await Product.updateMany({ _id: { $in: ids } }, data, {
			upsert: true,
		})

		await User.updateMany(
			{ _id: id_user },
			{
				balance: newBalance,
				tongtienmua: newTongtienmua,
			},
			{ upsert: true }
		)

		const newLogs = new Logs({
			id_user: id_user,
			user_name: user_name,
			soluongmua: parseInt(sl),
			id_loaisanpham: id_category,
			name_category: name_category,
			description_category: description_category,
			price_buy: totalPrice,
			id_sanpham: ids,
		})

		await newLogs.save()

		return {
			status: 400,
			result: {
				msg: 'Buy success',
				result: result,
			},
		}
	} catch (error) {
		return {
			status: 500,
			result: {
				msg: error.message,
			},
		}
	}
}

router.get('/buy_product', async (req, res) => {
	try {
		const { key, id, sl } = req.query

		if (!key || !id || !sl) {
			return res.status(400).json({ msg: 'Information is not provided' })
		}

		const nguoi_dung = await User.findOne({ key })
		if (!nguoi_dung) {
			return res.status(400).json({ msg: 'This user does not exist' })
		}

		// Get user_name
		const user_name = nguoi_dung.name

		const san_pham = await CategoryProduct.findOne({ number_order: id })

		if (!san_pham) {
			return res.status(400).json({ msg: 'This product does not exist' })
		}

		// Get id_category
		const id_category = san_pham._id

		let final = await handleBuyProducts(id_category, user_name, sl)

		res.status(final.status).json(final.result)
	} catch (err) {
		res.status(500).json({ msg: err.message })
	}
})

router.get('/check_balance', async (req, res) => {
	try {
		const { key } = req.query

		if (!key) {
			return res.status(400).json({ msg: 'Key is not provided' })
		}

		const nguoi_dung = await User.findOne({ key })
		if (!nguoi_dung) {
			return res.status(400).json({ msg: 'This user does not exist' })
		}

		const balance = nguoi_dung.balance
		const user_name = nguoi_dung.name

		res.status(200).json({ user_name, balance })
	} catch (error) {
		res.status(500).json({ msg: error.message })
	}
})

router.get('/check_amount', async (req, res) => {
	try {
		const { id } = req.query

		if (!id) {
			return res.status(400).json({ msg: 'Information is not provided' })
		}

		const san_pham = await CategoryProduct.findOne({ number_order: id })

		if (!san_pham) {
			return res.status(400).json({ msg: 'This product does not exist' })
		}

		const sql_find = {
			sell: { $in: 0 }, // 0: chua ban, 1: da ban
			status: { $in: 1 },
			id_loaisp: { $in: san_pham._id },
		}

		const name_product = san_pham.name
		let live_count = 0

		await Product.countDocuments(sql_find).then((count_products) => {
			live_count = count_products
		})

		res.status(200).json({ name_product, live_count })
	} catch (error) {
		res.status(500).json({ msg: error.message })
	}
})

router.get('/add_product', async (req, res) => {
	try {
		const { key, id, data } = req.query

		if (!key || !id || !data) {
			return res.status(400).json({ msg: 'Information is not provided' })
		}

		const nguoi_dung = await User.findOne({ key })
		if (!nguoi_dung) {
			return res.status(400).json({ msg: 'This user does not exist' })
		}

		const san_pham = await CategoryProduct.findOne({ number_order: id })

		if (!san_pham) {
			return res.status(400).json({ msg: 'This product does not exist' })
		}

		const role = nguoi_dung.role
		const id_category = san_pham._id

		if (role === 1) {
			let productSplit = data.trim().split('|')
			let newData = new Product({
				id_loaisp: id_category,
				data: data.trim(),
				id_fb: productSplit[0],
			})

			newData.save()

			return res.status(200).json({ msg: 'Add product success' })
		} else {
			return res.status(400).json({ msg: 'You are not admin' })
		}
	} catch (error) {
		res.status(500).json({ msg: error.message })
	}
})

router.post('/add_muti_product', authKey, async (req, res) => {
	try {
		const { id, data } = req.body

		if (!id || !data) {
			return res.status(400).json({ msg: 'Information is not provided' })
		}

		const san_pham = await CategoryProduct.findOne({ number_order: id })

		if (!san_pham) {
			return res.status(400).json({ msg: 'This product does not exist' })
		}

		const id_category = san_pham._id
		let newProduct = []
		data.forEach((value) => {
			let productSplit = value.trim().split('|')
			let infor = {
				id_loaisp: id_category,
				data: value,
				id_fb: productSplit[0],
			}
			newProduct.push(infor)
		})

		await Product.insertMany(newProduct)

		// console.log('newProduct: ', newProduct)

		res.status(200).json({ msg: 'Add product success' })
	} catch (error) {
		res.status(500).json({ msg: error.message })
	}
})

module.exports = router
