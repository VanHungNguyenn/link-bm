const axios = require('axios')

const HistoryBank = require('../../models/historyBank')
const Users = require('../../models/User')
const LichSuNapTien = require('../../models/lichsunaptien')
const MomoAndBankInfo = require('../../models/momoAndBankInfo')
const config = require('config')

const fakeAPI = [
	{
		CD: '+',
		Reference: 'FT21358021682529',
		TransID: 'FT21358021682529',
		TransactionDate: '24/12/2021',
		Amount: '1,000',
		Description: 'tk24h Laughing / FT21358021682529',
		CurrentBalance: 2486491,
	},
	{
		CD: '+',
		Reference: 'FT21358300176764',
		TransID: 'FT21358300176764',
		TransactionDate: '24/12/2021',
		Amount: '1,000',
		Description: 'tk24h vanhungnguyen / FT21358300176764',
		CurrentBalance: 2485491,
	},
	{
		CD: '-',
		Reference: 'FT21357585160007',
		TransID: 'FT21357585160007',
		TransactionDate: '23/12/2021',
		Amount: '-2,000,000',
		Description: 'cho tien mua vay / FT21357585160007',
		CurrentBalance: 2484491,
	},
	{
		CD: '-',
		Reference: 'FT21357849199420',
		TransID: 'FT21357849199420',
		TransactionDate: '23/12/2021',
		Amount: '-11,835,000',
		Description: '20307303590181998592 / FT21357849199420',
		CurrentBalance: 4484491,
	},
	{
		CD: '-',
		Reference: 'FT21357624293100',
		TransID: 'FT21357624293100',
		TransactionDate: '23/12/2021',
		Amount: '-150,000',
		Description: 'nap2930 / FT21357624293100',
		CurrentBalance: 16319491,
	},
]

const handleAutoBankCharge = async () => {
	try {
		const account_bank = config.get('ACCOUNT_NUMBER_BANK')

		await MomoAndBankInfo.findOne({
			account_bank: account_bank,
		}).then(async (x) => {
			const API_BANK = x.api
			const password_bank = x.password_bank

			// const res = await axios.get(
			// 	`https://api.web2m.com/historyapitcb/${password_bank}/${account_bank}/${API_BANK}`
			// )

			// const { transactions } = res.data

			const transactions = fakeAPI
			if (transactions.length > 0 && typeof transactions === 'object') {
				for (let i = 0; i < transactions.length; i++) {
					const transaction = transactions[i]
					const CD = transaction.CD
					const tranId = transaction.TransID
					const comment = transaction.Description.split('/')[0]
						.toLowerCase()
						.trim()
					const depositMoney = Number(
						transaction.Amount.replaceAll(',', '')
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

											await newHistoryMomo.save()
										} else {
											const user = comment.split(' ')[1]

											User.findOne({ name: user }).then(
												async (client) => {
													const { _id, name } = client

													const newHistoryBank =
														new HistoryBank({
															id_transaction:
																tranId,
															id_user: _id,
															name_user: name,
															depositMoney:
																depositMoney,
															status: 'Giao dịch tk24h thành công',
															comment: comment,
														})

													await newHistoryBank.save()

													await User.findOneAndUpdate(
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
															new LichSuNapTien({
																id_user: _id,
																name_user: name,
																noidung:
																	'Nạp tiền tự động bằng bank',
																tien_nap:
																	depositMoney,
															})

														await newLichSuNapTien.save()
													})
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
		console.log(error.message)
	}
}

module.exports = handleAutoBankCharge
