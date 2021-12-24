const axios = require('axios')

const HistoryMomo = require('../../models/historyMomo')
const Users = require('../../models/User')
const LichSuNapTien = require('../../models/lichsunaptien')
const config = require('config')
const MomoAndBankInfo = require('../../models/momoAndBankInfo')

const fakeAPI = [
	{
		ID: 'c252a4ca-2d55-42e2-a9f6-1b85a9a6b5a5',
		user: '01299999181',
		commandInd: '1640247902337000000_b4ac825c',
		tranId: 19303881433,
		clientTime: 1640247900394,
		ackTime: 1640247910232,
		finishTime: 1640247910091,
		tranType: 2018,
		io: 1,
		partnerId: '01632305444',
		partnerCode: 'momo',
		partnerName: 'NGUYỄN VĂN HÙNG',
		amount: 1000,
		comment: 'golike vanhung',
		status: 999,
		moneySource: 1,
		desc: 'Thành công',
		originalAmount: 1000,
		serviceId: 'transfer_p2p',
		lastUpdate: 1640247910232,
		receiverType: 1,
		extras: '{"loanId":0,"appSendChat":false,"loanIds":[],"stickers":"","themeUrl":"https://img.mservice.com.vn/app/img/transfer/theme/theme_momo_jump.png","vpc_CardType":"SML","vpc_TicketNo":"1.52.235.26","vpc_PaymentGateway":"","origMSource":1,"lixi_total":0.0,"lixi_count":1,"lixi_parent_id":"a5389659-e043-4cd1-b78d-8df7a06bbe2b","lixi_isFixed":true,"app_version":30290,"request_id_backend":"1640247909986_01632305444","business_trans_id":"1640247909986_01632305444","ispayment":2,"money_source":1,"ORIGINAL_PARTNER_ID":"01299999181","FEE_BANK":0.0,"FEE_MOMO":0.0}',
		channel: 'END_USER',
		otpType: 'NA',
		ipAddress: 'N/A',
		enableOptions: {
			voucher: true,
			discount: true,
			prepaid: true,
			desc: '',
		},
		_class: 'mservice.backend.entity.msg.TranHisMsg',
	},
	{
		ID: '53c06a68-bdb1-480f-885d-d1fa684e6c2f',
		user: '01299999181',
		commandInd: '1640248358503000000_f7a0f176',
		tranId: 19303835547,
		clientTime: 1640248358647,
		ackTime: 1640248366829,
		finishTime: 1640248366670,
		tranType: 2018,
		io: 1,
		partnerId: '0902699083',
		partnerCode: 'momo',
		partnerName: 'VŨ QUANG HUY',
		amount: 100,
		comment: 'Golike vuquanghuy',
		status: 999,
		moneySource: 1,
		desc: 'Thành công',
		originalAmount: 100,
		serviceId: 'transfer_p2p',
		lastUpdate: 1640248366829,
		receiverType: 1,
		extras: '{"loanId":0,"appSendChat":false,"loanIds":[],"stickers":"","themeUrl":"https://img.mservice.com.vn/app/img/transfer/theme/theme_momo_jump.png","vpc_CardType":"SML","vpc_TicketNo":"113.23.108.50","vpc_PaymentGateway":"","origMSource":1,"lixi_total":0.0,"lixi_count":1,"lixi_parent_id":"92726a10-d4ce-41a5-ae19-f8bd4a7f79d6","lixi_isFixed":true,"app_version":30290,"request_id_backend":"1640248366606_0902699083","business_trans_id":"1640248366606_0902699083","ispayment":2,"money_source":1,"ORIGINAL_PARTNER_ID":"01299999181","FEE_BANK":0.0,"FEE_MOMO":0.0}',
		channel: 'END_USER',
		otpType: 'NA',
		ipAddress: 'N/A',
		enableOptions: {
			voucher: true,
			discount: true,
			prepaid: true,
			desc: '',
		},
		_class: 'mservice.backend.entity.msg.TranHisMsg',
	},
	{
		ID: '4d2b3f99-71f2-4740-9b2b-204178bffbb8',
		user: '01299999181',
		commandInd: '1640251914409000000_9ceaead8',
		tranId: 19304917433,
		clientTime: 1640251912507,
		ackTime: 1640251920976,
		finishTime: 1640251920833,
		tranType: 2018,
		io: 1,
		partnerId: '01632305444',
		partnerCode: 'momo',
		partnerName: 'NGUYỄN VĂN HÙNG',
		amount: 1000,
		comment: 'tk24h vanhungnguyen',
		status: 999,
		moneySource: 1,
		desc: 'Thành công',
		originalAmount: 1000,
		serviceId: 'transfer_p2p',
		lastUpdate: 1640251920976,
		receiverType: 1,
		extras: '{"loanId":0,"appSendChat":false,"loanIds":[],"stickers":"","themeUrl":"https://img.mservice.com.vn/app/img/transfer/theme/theme_momo_jump.png","vpc_CardType":"SML","vpc_TicketNo":"1.52.235.26","vpc_PaymentGateway":"","origMSource":1,"lixi_total":0.0,"lixi_count":1,"lixi_parent_id":"d664b5e9-6366-4162-bd4a-b9bf7380f7d2","lixi_isFixed":true,"app_version":30290,"request_id_backend":"1640251920743_01632305444","business_trans_id":"1640251920743_01632305444","ispayment":2,"money_source":1,"ORIGINAL_PARTNER_ID":"01299999181","FEE_BANK":0.0,"FEE_MOMO":0.0}',
		channel: 'END_USER',
		otpType: 'NA',
		ipAddress: 'N/A',
		enableOptions: {
			voucher: true,
			discount: true,
			prepaid: true,
			desc: '',
		},
		_class: 'mservice.backend.entity.msg.TranHisMsg',
	},
]

const handleAutoMomoRecharge = async () => {
	try {
		await MomoAndBankInfo.findOne({
			number_phone: config.get('NUMBER_PHONE'),
		}).then(async (x) => {
			const API_MOMO = x.api

			// const res = await axios.get(
			// 	`https://api.web2m.com/historyapimomo/${API_MOMO}`
			// )

			// const { tranList } = res.data.momoMsg

			const tranList = fakeAPI

			if (tranList.length > 0 && typeof tranList === 'object') {
				for (let i = 0; i < tranList.length; i++) {
					const transaction = tranList[i]
					const tranId = transaction.tranId
					const comment = transaction.comment.toLowerCase().trim()
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
													const { _id, name } = client

													const newHistoryMomo =
														new HistoryMomo({
															id_transaction:
																tranId,
															id_user: _id,
															name_user: name,
															depositMoney:
																depositMoney,
															status: 'Giao dịch tk24h thành công',
															comment: comment,
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
															new LichSuNapTien({
																id_user: _id,
																name_user: name,
																noidung:
																	'Nạp tiền tự động bằng Momo',
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

module.exports = handleAutoMomoRecharge
