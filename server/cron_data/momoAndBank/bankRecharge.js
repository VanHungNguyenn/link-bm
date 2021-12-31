const axios = require('axios')

const HistoryBank = require('../../models/historyBank')
const Users = require('../../models/User')
const LichSuNapTien = require('../../models/lichsunaptien')
const MomoAndBankInfo = require('../../models/momoAndBankInfo')
const config = require('config')

const handleAutoBankCharge = async () => {
	try {
		const account_bank = config.get('ACCOUNT_NUMBER_BANK')

		await MomoAndBankInfo.findOne({
			account_bank: account_bank,
		}).then(async (x) => {
			const API_BANK = x.api
			const password_bank = x.password_bank

			const res = await axios.get(
				`https://api.web2m.com/historyapitcb/${password_bank}/${account_bank}/${API_BANK}`
			)

			const { transactions } = res.data

			//Test
			// const transactions = [
			// 	{
			// 		CD: '+',
			// 		Reference: 'FT21364237408875',
			// 		TransID: 'FT21364237408872',
			// 		TransactionDate: '30/12/2021',
			// 		Amount: '1,000',
			// 		Description: 'tk24h vanhungnguyen / FT21364237408876',
			// 		CurrentBalance: 9258709,
			// 	},
			// ]

			if (!transactions) {
				return
			}

			if (transactions.length > 0) {
				for (let i = 0; i < transactions.length; i++) {
					const transaction = transactions[i]
					const CD = transaction.CD
					const tranId = transaction.TransID
					const comment = transaction.Description.split('/')[0]
						.toLowerCase()
						.trim()

					const depositMoney = Number(
						transaction.Amount.replace(/,/g, '')
					)

					if (CD === '-') {
						await HistoryBank.findOne({
							id_transaction: tranId,
						})
							.sort({ date: -1 })
							.then(async (clientTransaction) => {
								if (clientTransaction === null) {
									// Không phải giao dịch của tk24h
									const newHistoryBank = new HistoryBank({
										id_transaction: tranId,
										status: 'Không phải giao dịch của tk24h',
										comment: comment,
										depositMoney: depositMoney,
									})

									await newHistoryBank.save()
								}
							})
					} else if (CD === '+') {
						await HistoryBank.findOne({
							id_transaction: tranId,
						})
							.sort({ date: -1 })
							.then(async (clientTransaction) => {
								if (clientTransaction === null) {
									// Không phải giao dịch của tk24h
									if (comment.split(' ')[0] !== 'tk24h') {
										const newHistoryBank = new HistoryBank({
											id_transaction: tranId,
											status: 'Không phải giao dịch của tk24h',
											comment: comment,
											depositMoney: depositMoney,
										})

										await newHistoryBank.save()
									} else {
										if (comment.split(' ').length !== 2) {
											const newHistoryBank =
												new HistoryBank({
													id_transaction: tranId,
													status: 'Giao dịch của tk24h, nhưng sai cú pháp',
													comment: comment,
													depositMoney: depositMoney,
												})

											await newHistoryBank.save()
										} else {
											const user = comment.split(' ')[1]

											Users.findOne({ name: user }).then(
												async (client) => {
													if (!client) {
														const newHistoryBank =
															new HistoryBank({
																id_transaction:
																	tranId,
																status: 'Giao dịch của tk24h, nhưng không tìm thấy tài khoản',
																comment:
																	comment,
																depositMoney:
																	depositMoney,
															})

														await newHistoryBank.save()
													} else {
														const { _id, name } =
															client

														const newHistoryBank =
															new HistoryBank({
																id_transaction:
																	tranId,
																id_user: _id,
																name_user: name,
																depositMoney:
																	depositMoney,
																status: 'Giao dịch tk24h thành công',
																comment:
																	comment,
															})

														await newHistoryBank.save()

														await Users.findOneAndUpdate(
															{
																name: name,
															},
															{
																$inc: {
																	balance:
																		depositMoney,
																	tongtiennap:
																		depositMoney,
																},
															}
														).then(async () => {
															const newLichSuNapTien =
																new LichSuNapTien(
																	{
																		id_user:
																			_id,
																		name_user:
																			name,
																		noidung:
																			'Nạp tiền tự động bằng bank',
																		tien_nap:
																			depositMoney,
																	}
																)

															await newLichSuNapTien.save()
														})
													}
												}
											)
										}
									}
								}
							})
					}
				}
			}
		})
	} catch (error) {
		console.log('Bank: ', error.message)
	}
}

module.exports = handleAutoBankCharge
