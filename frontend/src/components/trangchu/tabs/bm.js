import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
	getProductByCategoryClient,
	muaTaikhoan,
} from '../../../actions/itemActions'
import DataTable from 'react-data-table-component'
import Swal from 'sweetalert2'
import { FireOutlined, ShoppingCartOutlined } from '@ant-design/icons'

class Bm extends Component {
	state = {}
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
			Swal.fire('Đã hết sản phẩm!', '', 'error')
			return false
		}
		if (price > balance) {
			Swal.fire('Tài khoản không đủ để mua!', '', 'error')
			return false
		}
		if (!Number.isInteger(sl)) {
			Swal.fire('Số lượng mua bạn đã nhập không hợp lệ!', '', 'error')
			return false
		}
		if (count_selected < sl) {
			Swal.fire('Bạn đã nhập quá số sản phẩm cho phép!', '', 'error')
			return false
		}
		if (sl <= 0) {
			Swal.fire('Số lượng mua bạn đã nhập không hợp lệ!', '', 'error')
			return false
		}
		if (typeof sl === 'undefined') {
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
		var that = this

		// const listbm = <h1>Hello</h1>

		// const listvia = <h1>Hello</h1>

		const listbm = (
			<>
				<div className='table-responsive'>
					<table class='table table-striped table-bordered table-hover table-sm'>
						<thead class='thead-light'>
							<tr>
								<th scope='col'>Name</th>

								<th scope='col' style={{ width: 80 }}>
									Country
								</th>
								<th scope='col' style={{ width: 100 }}>
									Available
								</th>
								<th scope='col' style={{ width: 80 }}>
									Price
								</th>
								<th scope='col' style={{ width: 100 }}>
									Quantity
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
								if (value.type == 'BM') {
									var name_input_soluongmua =
										'soluongmua_' + index
									return (
										<>
											<tr>
												<th scope='row'>
													{value.name}
												</th>
												{/* <td>{value.type}</td> */}
												{/* <td>{value.country}</td> */}
												<td>
													<span
														class={`flag-icon flag-icon-${value.country}`}
													></span>
												</td>

												<td className='text-danger'>
													{value.live_count}
												</td>
												<td style={{ color: 'blue' }}>
													{that.formatMoney(
														value.price
													)}
													đ{' '}
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
															onChange={
																that.onChange
															}
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
																	'font-size':
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
										</>
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
		const listvia = (
			<>
				<div className='table-responsive'>
					<table class='table table-striped table-bordered table-hover table-sm'>
						<thead class='thead-light'>
							<tr>
								<th scope='col'>Name</th>
								{/* <th scope='col' style={{ width: 80 }}>
									Type
								</th> */}
								<th scope='col' style={{ width: 80 }}>
									Country
								</th>
								<th scope='col' style={{ width: 100 }}>
									Available
								</th>
								<th scope='col' style={{ width: 80 }}>
									Price
								</th>
								<th scope='col' style={{ width: 100 }}>
									Quantity
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
									return (
										<>
											<tr>
												<th scope='row'>
													{value.name}
												</th>
												{/* <td>{value.type}</td>
												<td>{value.country}</td> */}
												<td>
													<span
														class={`flag-icon flag-icon-${value.country}`}
													></span>
												</td>
												<td className='text-danger'>
													{value.live_count}
												</td>
												<td style={{ color: 'blue' }}>
													{that.formatMoney(
														value.price
													)}
													đ{' '}
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
															onChange={
																that.onChange
															}
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
																	'font-size':
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
										</>
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

		return (
			<Fragment>
				<div
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
				</div>
				<div
					className='content custom_content'
					style={{ paddingTop: '0px' }}
				>
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
								</ul>
							</div>
						</div>
					</div>
				</div>
			</Fragment>
		)
	}
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	item: state.item,
})

export default connect(mapStateToProps, {
	getProductByCategoryClient,
	muaTaikhoan,
})(Bm)
