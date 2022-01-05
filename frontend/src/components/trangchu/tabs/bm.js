import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import {
	getProductByCategoryClient,
	muaTaikhoan,
	laylichsumuauser,
	laylichsunapuser,
} from '../../../actions/itemActions'
import Swal from 'sweetalert2'
import { ShoppingCartOutlined } from '@ant-design/icons'
import iconList from '../../../config/icon'
import { timeAgo } from '../../../utils/timeAgo'

const hideName = (name) => {
	let newName = ''
	const nameLength = name.length
	for (let i = 0; i < nameLength; i++) {
		if (i > nameLength - 5) {
			newName += '*'
		} else {
			newName += name[i]
		}
	}

	return newName
}

const humanized_time_span = (date, ref_date, date_formats, time_units) => {
	//Date Formats must be be ordered smallest -> largest and must end in a format with ceiling of null
	date_formats = date_formats || {
		past: [
			{ ceiling: 60, text: '$seconds giấy trước' },
			{ ceiling: 3600, text: '$minutes phút trước' },
			{ ceiling: 86400, text: '$hours giờ trước' },
			{ ceiling: 2629744, text: '$days ngày trước' },
			{ ceiling: 31556926, text: '$months tháng trước' },
			{ ceiling: null, text: '$years năm trước' },
		],
		future: [
			{ ceiling: 60, text: 'trước $seconds giây' },
			{ ceiling: 3600, text: 'trước $minutes phút' },
			{ ceiling: 86400, text: 'trước $hours giờ' },
			{ ceiling: 2629744, text: 'trước $days ngày' },
			{ ceiling: 31556926, text: 'trước $months tháng' },
			{ ceiling: null, text: 'trước $years năm' },
		],
	}
	//Time units must be be ordered largest -> smallest
	time_units = time_units || [
		[31556926, 'năm'],
		[2629744, 'tháng'],
		[86400, 'ngày'],
		[3600, 'giờ'],
		[60, 'phút'],
		[1, 'giây'],
	]

	date = new Date(date)
	ref_date = ref_date ? new Date(ref_date) : new Date()
	var seconds_difference = (ref_date - date) / 1000

	var tense = 'past'
	if (seconds_difference < 0) {
		tense = 'future'
		seconds_difference = 0 - seconds_difference
	}

	function get_format() {
		for (var i = 0; i < date_formats[tense].length; i++) {
			if (
				date_formats[tense][i].ceiling == null ||
				seconds_difference <= date_formats[tense][i].ceiling
			) {
				return date_formats[tense][i]
			}
		}
		return null
	}

	function get_time_breakdown() {
		var seconds = seconds_difference
		var breakdown = {}
		for (var i = 0; i < time_units.length; i++) {
			var occurences_of_unit = Math.floor(seconds / time_units[i][0])
			seconds = seconds - time_units[i][0] * occurences_of_unit
			breakdown[time_units[i][1]] = occurences_of_unit
		}
		return breakdown
	}

	function render_date(date_format) {
		var breakdown = get_time_breakdown()
		var time_ago_text = date_format.text.replace(/\$(\w+)/g, function () {
			return breakdown[arguments[1]]
		})
		return depluralize_time_ago_text(time_ago_text, breakdown)
	}

	function depluralize_time_ago_text(time_ago_text, breakdown) {
		for (var i in breakdown) {
			if (breakdown[i] == 1) {
				var regexp = new RegExp('\\b' + i + '\\b')
				time_ago_text = time_ago_text.replace(regexp, function () {
					return arguments[0].replace(/s\b/g, '')
				})
			}
		}
		return time_ago_text
	}

	return render_date(get_format())
}

class Bm extends Component {
	state = {}

	componentDidMount() {
		this.props.laylichsumuauser()
		this.props.laylichsunapuser()
	}

	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		})
	}

	buyNow(
		soluongmua_selected,
		price_selected,
		count_selected,
		id_selected,
		name_selected,
		description_selected
	) {
		var sl = parseInt(this.state[soluongmua_selected])
		var price = price_selected * sl
		var balance = this.props.auth.user.balance
		var tongtienmua = this.props.auth.user.tongtienmua
		if (count_selected <= 0) {
			//
			Swal.fire('Đã hết sản phẩm!', '', 'error')
			return false
		}
		if (price > balance) {
			Swal.fire('Tài khoản không đủ để mua!', '', 'error')
			return false
		}
		if (!Number.isInteger(sl)) {
			//
			Swal.fire('Số lượng mua bạn đã nhập không hợp lệ!', '', 'error')
			return false
		}
		if (count_selected < sl) {
			//
			Swal.fire('Bạn đã nhập quá số sản phẩm cho phép!', '', 'error')
			return false
		}
		if (sl <= 0) {
			//
			//
			Swal.fire('Số lượng mua bạn đã nhập không hợp lệ!', '', 'error')
			return false
		}
		if (typeof sl === 'undefined') {
			//
			Swal.fire('Nhập số lượng muốn mua!', '', 'error')
			return false
		}
		Swal.fire({
			title: 'Bạn có chắc chắn muốn mua?',
			text:
				'Số lượng: ' +
				sl +
				' - Tổng tiền: ' +
				this.formatMoney(price) +
				'đ',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Có',
		}).then((result) => {
			if (result.value) {
				var totalpriceuser = balance - price
				var tienmua = parseInt(tongtienmua) + price
				this.props.muaTaikhoan(
					id_selected,
					sl,
					totalpriceuser,
					name_selected,
					description_selected,
					price_selected,
					tienmua
				)
			}
		})
	}
	formatMoney(amount, decimalCount = 0, decimal = '.', thousands = ',') {
		try {
			decimalCount = Math.abs(decimalCount)
			decimalCount = isNaN(decimalCount) ? 2 : decimalCount

			const negativeSign = amount < 0 ? '-' : ''

			let i = parseInt(
				(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
			).toString()
			let j = i.length > 3 ? i.length % 3 : 0

			return (
				negativeSign +
				(j ? i.substr(0, j) + thousands : '') +
				i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
				(decimalCount
					? decimal +
					  Math.abs(amount - i)
							.toFixed(decimalCount)
							.slice(2)
					: '')
			)
		} catch (e) {
			console.log(e)
		}
	}

	render() {
		var bmlist = this.props.item.items
		const { userlogs, userdeposit } = this.props.item

		var that = this

		// const listbm = (
		// 	<>
		// 		<div className='table-responsive'>
		// 			<table className='table table-striped table-bordered table-hover table-sm'>
		// 				<thead className='thead-light'>
		// 					<tr>
		// 						<th scope='col'>Tên sản phẩm</th>

		// 						<th scope='col' style={{ width: 80 }}>
		// 							Quốc gia
		// 						</th>
		// 						<th scope='col' style={{ width: 100 }}>
		// 							Hiện có
		// 						</th>
		// 						<th scope='col' style={{ width: 80 }}>
		// 							Đơn giá
		// 						</th>
		// 						<th scope='col' style={{ width: 100 }}>
		// 							Số lượng
		// 						</th>
		// 						<th
		// 							scope='col'
		// 							className='align-middle'
		// 							style={{ width: 100 }}
		// 						>
		// 							Action
		// 						</th>
		// 					</tr>
		// 				</thead>
		// 				<tbody>
		// 					{bmlist.map(function (value, index) {
		// 						if (value.type == 'BM') {
		// 							var name_input_soluongmua =
		// 								'soluongmua_' + index

		// 							return (
		// 								<tr>
		// 									<th scope='row'>
		// 										{value.icon ? (
		// 											<img
		// 												style={{
		// 													width: 20,
		// 												}}
		// 												src={
		// 													iconList[
		// 														renderIcon(
		// 															value.icon
		// 														)
		// 													].image
		// 												}
		// 												alt='logo'
		// 											/>
		// 										) : null}{' '}
		// 										{value.name}
		// 									</th>
		// 									<td>
		// 										<span
		// 											className={`flag-icon flag-icon-${value.country}`}
		// 										></span>
		// 									</td>
		// 									<td className='text-danger'>
		// 										{value.live_count}
		// 									</td>
		// 									<td style={{ color: 'blue' }}>
		// 										{that.formatMoney(value.price)}đ{' '}
		// 									</td>
		// 									<td>
		// 										{that.props.auth.user !=
		// 										null ? (
		// 											<input
		// 												type='number'
		// 												className='form-control'
		// 												name={
		// 													name_input_soluongmua
		// 												}
		// 												value={
		// 													that.state[
		// 														name_input_soluongmua
		// 													]
		// 												}
		// 												onChange={that.onChange}
		// 											/>
		// 										) : (
		// 											''
		// 										)}
		// 									</td>
		// 									<td>
		// 										{that.props.auth.user !=
		// 										null ? (
		// 											<button
		// 												className='btn btn-primary btn-nw'
		// 												onClick={() => {
		// 													that.buyNow(
		// 														name_input_soluongmua,
		// 														value.price,
		// 														value.live_count,
		// 														value._id,
		// 														value.name,
		// 														value.description
		// 													)
		// 												}}
		// 											>
		// 												<ShoppingCartOutlined
		// 													style={{
		// 														'font-size':
		// 															'16px',
		// 														verticalAlign:
		// 															'0.125em',
		// 													}}
		// 												/>{' '}
		// 												Mua
		// 											</button>
		// 										) : (
		// 											<span className='text-danger font-bold'>
		// 												Đăng nhập để mua
		// 											</span>
		// 										)}
		// 									</td>
		// 								</tr>
		// 							)
		// 						} else {
		// 							return ''
		// 						}
		// 					})}
		// 				</tbody>
		// 			</table>
		// 		</div>
		// 	</>
		// )

		const listvia = (
			<>
				<div className='table-responsive'>
					<table className='table table-striped table-bordered table-hover table-sm'>
						<thead className='thead-light'>
							<tr>
								<th scope='col' style={{ width: 50 }}>
									Id
								</th>
								<th scope='col'>Tên sản phẩm</th>
								{/* <th scope='col' style={{ width: 80 }}>
									Type
								</th> */}
								<th scope='col' style={{ width: 80 }}>
									Quốc gia
								</th>
								<th scope='col' style={{ width: 80 }}>
									Hiện có
								</th>
								<th scope='col' style={{ width: 80 }}>
									Đơn giá
								</th>
								<th scope='col' style={{ width: 100 }}>
									Số lượng
								</th>
								<th
									scope='col'
									className='align-middle'
									style={{ width: 100 }}
								>
									Action
								</th>
							</tr>
						</thead>
						<tbody>
							{bmlist.map(function (value, index) {
								if (value.type == 'VIA') {
									var name_input_soluongmua =
										'soluongmua_' + index

									{
										/* console.log(value) */
									}

									return (
										<tr key={index}>
											<td>
												<span>
													{value.number_order}
												</span>
											</td>

											<td scope='row'>
												<h4
													style={{
														fontSize: '16px',
														display: 'flex',
														alignItems: 'center',
														marginBottom: 0,
														fontWeight: 400,
													}}
												>
													{value.icon ? (
														<img
															style={{
																width: 20,
																marginRight:
																	'5px',
															}}
															src={
																iconList[
																	renderIcon(
																		value.icon
																	)
																].image
															}
															alt='logo'
														/>
													) : null}{' '}
													{value.name}
												</h4>
											</td>

											<td>
												<span
													className={`flag-icon flag-icon-${value.country}`}
												></span>
											</td>
											<td className='text-danger'>
												{value.live_count}
											</td>
											<td style={{ color: 'blue' }}>
												{that.formatMoney(value.price)}đ{' '}
											</td>
											<td>
												{that.props.auth.user !=
												null ? (
													<input
														type='number'
														className='form-control'
														name={
															name_input_soluongmua
														}
														value={
															that.state[
																name_input_soluongmua
															]
														}
														onChange={that.onChange}
													/>
												) : (
													''
												)}
											</td>
											<td>
												{that.props.auth.user !=
												null ? (
													<button
														className='btn btn-primary btn-nw'
														onClick={() => {
															that.buyNow(
																name_input_soluongmua,
																value.price,
																value.live_count,
																value._id,
																value.name,
																value.description
															)
														}}
													>
														<ShoppingCartOutlined
															style={{
																fontSize:
																	'16px',
																verticalAlign:
																	'0.125em',
															}}
														/>{' '}
														Mua
													</button>
												) : (
													<span className='text-danger font-bold'>
														Đăng nhập để mua
													</span>
												)}
											</td>
										</tr>
									)
								} else {
									return ''
								}
							})}
						</tbody>
					</table>
				</div>
			</>
		)

		const listHistoryOrder = (
			<>
				<div className='table-responsive'>
					<table className='table table-striped table-bordered table-hover table-sm'>
						<thead className='thead-light'>
							<tr>
								<th scope='col' style={{ width: 160 }}>
									Người mua
								</th>

								<th scope='col'>Logs</th>
								<th scope='col' style={{ width: 120 }}>
									Giá
								</th>
								<th scope='col' style={{ width: 140 }}>
									Thời gian
								</th>
							</tr>
						</thead>
						<tbody>
							{userlogs.map((item, i) => {
								return (
									<tr key={i}>
										<th
											scope='row'
											style={{
												textAlign: 'center',
												verticalAlign: 'middle',
											}}
										>
											{hideName(item.user_name)
												? hideName(item.user_name)
												: item.user_name}
										</th>

										<td
											style={{
												textAlign: 'left',
												paddingLeft: 20,
											}}
										>
											Mua {item.soluongmua}{' '}
											{item.name_category}
										</td>

										<td>
											{that.formatMoney(
												item.price_buy /
													parseInt(item.soluongmua)
											)}{' '}
											VNĐ
										</td>

										<td>
											{timeAgo.format(
												Date.parse(item.ngaymua)
											)}
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			</>
		)

		const listHistoryRecharge = (
			<>
				<div className='table-responsive'>
					<table className='table table-striped table-bordered table-hover table-sm'>
						<thead className='thead-light'>
							<tr>
								<th scope='col' style={{ width: 160 }}>
									Người mua
								</th>

								<th scope='col'>Logs</th>
								<th scope='col' style={{ width: 140 }}>
									Thời gian
								</th>
							</tr>
						</thead>
						<tbody>
							{userdeposit.map((item, i) => {
								return (
									<tr key={i}>
										<th
											scope='row'
											style={{
												textAlign: 'center',
												verticalAlign: 'middle',
											}}
										>
											{hideName(item.name_user)
												? hideName(item.name_user)
												: item.name_user}
										</th>

										<td
											style={{
												textAlign: 'left',
												paddingLeft: 20,
											}}
										>
											Nạp{' '}
											{that.formatMoney(item.tien_nap)}{' '}
											VNĐ vào tài khoản
										</td>

										<td>
											{timeAgo.format(
												Date.parse(item.thoigian_nap)
											)}
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			</>
		)

		return (
			<Fragment>
				{/* Danh sách BM */}
				{/* <div
					className='content custom_content'
					style={{ paddingTop: '0px' }}
				>
					<div className='card'>
						<div className='card-header'>
							<h4 className='card-title'>
								Danh sách{' '}
								<span className='text-muted font-bold'>BM</span>
							</h4>
						</div>
						<div className='card-body border-bottom-none'>
							<div className='row'>{listbm}</div>
						</div>
					</div>
				</div> */}
				{/* Danh sách VIA */}
				<div
					className='content custom_content'
					style={{ paddingTop: '0px' }}
				>
					<h2 style={{ textAlign: 'center' }}>DANH SÁCH TÀI KHOẢN</h2>
					<p style={{ textAlign: 'center', fontStyle: 'italic' }}>
						TK24H.COM cung cấp tài khoản quảng cáo Facebook: Tài
						khoản Cá nhân (VIA, CLONE) - Mail verify (HOTMAIL,
						GMAIL)
					</p>
					<div className='card'>
						<div className='card-header'>
							<h3 className='card-title'>
								Danh sách{' '}
								<span className='text-muted font-bold'>
									VIA
								</span>
							</h3>
						</div>
						<div className='card-body border-bottom-none'>
							<div className='row'>{listvia}</div>
						</div>
					</div>
				</div>
				{/* Lịch sử order */}
				<div className='content' style={{ paddingTop: '0px' }}>
					<div className='card'>
						<div className='card-header'>
							<h3 className='card-title'>Lịch sử Order</h3>
						</div>
						<div className='card-body border-bottom-none'>
							<div className='row'>{listHistoryOrder}</div>
						</div>
					</div>
				</div>
				{/* Lịch sử nạp tiền */}
				<div className='content' style={{ paddingTop: '0px' }}>
					<div className='card'>
						<div className='card-header'>
							<h3 className='card-title'>Lịch sử Nạp tiền</h3>
						</div>
						<div className='card-body border-bottom-none'>
							<div className='row'>{listHistoryRecharge}</div>
						</div>
					</div>
				</div>
				{/* Chính sách hệ thống */}
				<div className='content' style={{ paddingTop: '0px' }}>
					<div className='card'>
						<div className='card-header'>
							<h3 className='card-title'>
								Chính sách của hệ thống!
							</h3>
						</div>
						<div className='card-body border-bottom-none'>
							<div className='alert alert-primary alert-dismissable'>
								<ul style={{ marginBottom: '0px' }}>
									<li>
										Khi mua via hệ thống đã check live acc
										rồi xuất cho bạn (nick có 2fa) nên bạn
										nào hiểu rõ hãy dùng tránh khiếu nại hệ
										thống
									</li>
									<li>
										Nên login ở dạng{' '}
										<a
											href='https://m.facebook.com'
											target='_blank'
										>
											m.facebook.com
										</a>{' '}
										để hạn chế checkpoint vì acc khi xuất ra
										đã check live trước khi xuất!
									</li>
									<li>
										Vui lòng đọc kỹ chính sách bảo hành
										trước khi mua tài khoản trên hệ thống
										TK24H.com. Mọi trường hợp cố tình gian
										lận bảo hành sẽ bị khoá tài khoản trên
										hệ thống vĩnh viễn.
									</li>
									<li>
										Tất cả tài nguyên trên website chỉ phục
										vụ với mục đích QUẢNG CÁO. Tất cả hành
										vi sử dụng vi phạm nào trái pháp luật
										Việt Nam, chúng tôi đều không chịu bất
										cứ trách nhiệm nào!
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</Fragment>
		)
	}
}

const renderIcon = (icon) => {
	for (let i = 0; i < iconList.length; i++) {
		if (iconList[i].code === icon) {
			return i
		}
	}
	return null
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	item: state.item,
})

export default connect(mapStateToProps, {
	getProductByCategoryClient,
	muaTaikhoan,
	laylichsumuauser,
	laylichsunapuser,
})(Bm)
