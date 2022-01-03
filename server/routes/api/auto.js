const express = require('express')
const router = express.Router()
const axios = require('axios')
var request = require('request')

// User Model
const CategoryProduct = require('../../models/category_product')
const Product = require('../../models/product')
const User = require('../../models/User')

async function checkUID(uid = '') {
	try {
		const url = 'https://graph.fb.me/' + uid + '/picture?redirect=false'
		const check = await axios.get(url)

		if (typeof check.data.height !== 'undefined') {
			return 0
		} else {
			return 1
		}
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

		await CategoryProduct.findById(id_category)
			.sort({ date: -1 })
			.then(async (categoryProduct) => {
				const price1product = categoryProduct.price
				const name_category = categoryProduct.name
				const description_category = categoryProduct.description
				const totalPrice = parseInt(sl) * price1product

				await User.findOne({ name: user_name })
					.sort({ date: -1 })
					.then(async (client) => {
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
						const newTongtienmua = String(
							parseInt(tongtienmua) + totalPrice
						)

						// Data update when user buy
						var data = {
							sell: 1,
							id_user_buy: id_user,
							date_sell: Date.now(),
							name_user: user_name,
						}

						await Product.find({
							id_loaisp: id_category,
							sell: 0,
							status: 1,
						})
							.sort({ date: 1 })
							.limit(Number(sl))
							.then(async (products) => {
								if (products.length >= parseInt(sl)) {
									// Start handle checkpoint
									let checkpoint = 0
									for (var i = 0; i < products.length; i++) {
										checkpoint = await checkUID(
											products[i].data.split('|')[0]
										)

										if (checkpoint == 1) {
											var query = {
												_id: products[i]._id,
											}

											await Product.findOneAndUpdate(
												query,
												{ status: 2 },
												{ upsert: true }
											)

											await handleBuyProducts(
												id_category,
												user_name,
												sl,
												res
											)
										}
									}

									// End handle checkpoint

									var ids = []

									products.forEach((value) => {
										ids.push(value._id)
									})

									const result = products

									await Product.updateMany(
										{ _id: { $in: ids } },
										data,
										{ upsert: true },
										() => {
											User.updateMany(
												{ _id: id_user },
												{
													balance: newBalance,
													tongtienmua: newTongtienmua,
												},
												{ upsert: true },
												() => {
													const newLogs = new Logs({
														id_user: id_user,
														user_name: user_name,
														soluongmua:
															parseInt(sl),
														id_loaisanpham:
															id_category,
														name_category:
															name_category,
														description_category:
															description_category,
														price_buy: totalPrice,
														id_sanpham: ids,
													})

													newLogs.save().then(() => {
														return {
															status: 400,
															result: {
																msg: 'Buy success',
																result: result,
															},
														}
													})
												}
											)
										}
									)
								} else {
									return {
										status: 400,
										result: {
											msg: 'Out of stock',
										},
									}
								}
							})
					})
			})
	} catch (error) {
		return {
			status: 500,
			result: {
				msg: error.message,
			},
		}
	}
}

router.post('/buy_product', async (req, res) => {
	try {
		const { key, id, sl } = req.query

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

		const final = await handleBuyProducts(id_category, user_name, sl)
		console.log('Final.result: ', final)

		res.status(final.status).json(final.result)
	} catch (err) {
		res.status(500).json({ msg: err.message })
	}
})

module.exports = router
