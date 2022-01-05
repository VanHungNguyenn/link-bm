const axios = require('axios')

const HistoryMomo = require('../../models/historyMomo')
const Users = require('../../models/User')
const LichSuNapTien = require('../../models/lichsunaptien')
const config = require('config')
const MomoAndBankInfo = require('../../models/momoAndBankInfo')

const handleAutoMomoRecharge = async () => {
	try {
		await MomoAndBankInfo.findOne({
			number_phone: config.get('NUMBER_PHONE'),
		}).then(async (x) => {
			const API_MOMO = x.api

			const res = await axios.get(
				`https://api.web2m.com/historyapimomo/${API_MOMO}`
			)

			const { tranList } = res.data.momoMsg
			if (!tranList) {
				return
			}

			if (tranList.length > 0 && typeof tranList === 'object') {
				for (let i = 0; i < tranList.length; i++) {
					const transaction = tranList[i]
					const tranId = transaction.tranId
					const comment = transaction.comment
						? transaction.comment.toLowerCase().trim()
						: ''
					const depositMoney = transaction.amount
					const desc = transaction.desc

					if (desc === 'Thành công') {
						// Tìm xem đã lưu lịch sử chưa
						await HistoryMomo.findOne({ id_transaction: tranId })
							.sort({ date: -1 })
							.then(async (clientTransaction) => {
								// Nếu chưa lưu lịch sử thì lưu vào
								if (clientTransaction === null) {
									// Không phải giao dịch của tk24h
									if (comment.split(' ')[0] !== 'tk24h') {
										const newHistoryMomo = new HistoryMomo({
											id_transaction: tranId,
											status: 'Không phải giao dịch của tk24h',
											comment: comment,
											depositMoney: depositMoney,
										})

										await newHistoryMomo.save()
									} else {
										if (comment.split(' ').length !== 2) {
											const newHistoryMomo =
												new HistoryMomo({
													id_transaction: tranId,
													status: 'Giao dịch của tk24h, nhưng sai cú pháp',
													comment: comment,
													depositMoney: depositMoney,
												})

											await newHistoryMomo.save()
										} else {
											const user = comment.split(' ')[1]

											Users.findOne({ name: user }).then(
												async (client) => {
													if (!client) {
														const newHistoryMomo =
															new HistoryMomo({
																id_transaction:
																	tranId,
																status: 'Giao dịch của tk24h, nhưng không tìm thấy tài khoản',
																comment:
																	comment,
																depositMoney:
																	depositMoney,
															})

														await newHistoryMomo.save()
													} else {
														const { _id, name } =
															client

														const newHistoryMomo =
															new HistoryMomo({
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

														await newHistoryMomo.save()

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
																new LichSuNapTien(
																	{
																		id_user:
																			_id,
																		name_user:
																			name,
																		noidung:
																			'Nạp tiền tự động bằng Momo',
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
		console.log('Momo: ', error.message)
	}
}

module.exports = handleAutoMomoRecharge
