import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux'

import { cLinkBM, cIDBM } from '../../actions/itemActions'
import Swal from 'sweetalert2'
class CheckBm extends Component {
	state = {
		so_luong: '10',
		link_bm: '',
		link_idbm: '',
	}
	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value })
	}
	checkLinkBm() {
		if (this.state.link_bm === '') {
			Swal.fire('Link BM không được trống', '', 'error')
			return false
		}
		var that = this
		var link_bm = this.state.link_bm.split('\n')
		link_bm.forEach(function (value, index) {
			that.props.cLinkBM(
				value,
				that.state.so_luong,
				that.props.item.notifi.cookie_bm,
				that.props.item.notifi.token_bm
			)
		})
	}
	checkLinkIdBm() {
		if (this.state.link_idbm === '') {
			Swal.fire('ID BM không được trống', '', 'error')
			return false
		}
		var that = this
		var link_idbm = this.state.link_idbm.split('\n')
		link_idbm.forEach(function (value, index) {
			that.props.cIDBM(
				value,
				that.state.so_luong,
				that.props.item.notifi.cookie_bm,
				that.props.item.notifi.token_bm
			)
		})
	}
	render() {
		const { checkBm } = this.props.item
		var link_hoatdong = 0
		var link_khonghoatdong = 0
		var bm50 = 0
		var bm250 = 0
		var taotkqc = 0
		var chuatkqc = 0
		var camqc = 0
		var khongcamqc = 0
		var batbuocverimail = 0
		var khongbatbuocverimail = 0
		if (checkBm.length > 0) {
			checkBm.forEach(function (value, index) {
				if (value.requestStatus === 1) {
					link_hoatdong++
				}
				if (value.requestStatus === 0) {
					link_khonghoatdong++
				}
				if (
					value.sharing_eligibility_status ===
					'disabled_due_to_trust_tier'
				) {
					bm50++
				} else {
					bm250++
				}
				if (value.can_create_ad_account) {
					taotkqc++
				} else {
					chuatkqc++
				}
				if (value.camquangcao) {
					camqc++
				} else {
					khongcamqc++
				}
				if (value.verimail) {
					batbuocverimail++
				} else {
					khongbatbuocverimail++
				}
			})
		}
		const listBM = (
			<Fragment>
				{checkBm.map(function (value, index) {
					return (
						<div key={index} className='alert-success'>
							<ul style={{ 'list-style': 'decimal' }}>
								<li>
									<th className='text-center' scope='row'>
										{index + 1}
									</th>
									<td className='font-w600'>
										{value.businessID}|
									</td>
									<td className='font-w600'>{value.name}|</td>
									<td className='font-w600'>
										{value.linkbm}|
									</td>
									<td className='font-w600'>
										{value.sharing_eligibility_status ===
										'disabled_due_to_trust_tier'
											? 'BM 50'
											: 'BM 250'}
										|
									</td>
									<td className='font-w600'>
										{value.verimail
											? 'Bắt buộc Verimail'
											: 'Không bắt buộc Verimail'}
										|
									</td>
									<td className='font-w600'>
										{value.camquangcao
											? 'Cấm QC'
											: 'Không cấm QC'}
										|
									</td>
									<td className='font-w600'>
										{value.can_create_ad_account
											? 'Đã tạo TKQC'
											: 'Chưa tạo TKQC'}
										|
									</td>
									<td className='font-w600'>
										{value.requestStatus === 1
											? 'Hoạt động'
											: 'Không hoạt động'}
									</td>
								</li>
							</ul>
						</div>
					)
				})}
			</Fragment>
		)
		return (
			<Fragment>
				<div className='content'>
					<div className='block block-rounded block-bordered'>
						<div className='block-header block-header-default border-bottom'>
							<h3 className='block-title'>Check BM</h3>
						</div>
						<div className='block-content'>
							<div
								className='form-group'
								style={{ display: 'none' }}
							>
								<label>Số luồng</label>
								<input
									className='form-control'
									type='number'
									name='so_luong'
									value={this.state.so_luong}
									onChange={this.onChange}
								/>
							</div>
							<div className='form-group'>
								<div className='d-flex'>
									<div className='col-md-6'>
										<div className='form-group'>
											<label>List link BM</label>
											<textarea
												className='form-control'
												name='link_bm'
												value={this.state.link_bm}
												onChange={this.onChange}
											></textarea>
										</div>
										<div className='form-group'>
											<button
												className='btn btn-primary'
												style={{ width: '100%' }}
												onClick={() => {
													this.checkLinkBm()
												}}
											>
												Check link
											</button>
										</div>
									</div>
									<div className='col-md-6'>
										<div className='form-group'>
											<label>List link IDBM</label>
											<textarea
												className='form-control'
												name='link_idbm'
												value={this.state.link_idbm}
												onChange={this.onChange}
											></textarea>
										</div>
										<div className='form-group'>
											<button
												className='btn btn-primary'
												style={{ width: '100%' }}
												onClick={() => {
													this.checkLinkIdBm()
												}}
											>
												Check IDBM
											</button>
										</div>
									</div>
								</div>
							</div>
							<div className='form-group'>
								<div className='alert alert-primary'>
									<div className='d-flex'>
										<div className='col-md-6'>
											<div className='d-flex'>
												<label className='col-md-6'>
													Link hoạt động:
												</label>
												<div className='col-md-3'>
													{link_hoatdong}
												</div>
											</div>
											<div className='d-flex'>
												<label className='col-md-6'>
													BM 50:
												</label>
												<div className='col-md-3'>
													{bm50}
												</div>
											</div>
											<div className='d-flex'>
												<label className='col-md-6'>
													Đã tạo QC:
												</label>
												<div className='col-md-3'>
													{taotkqc}
												</div>
											</div>
											<div className='d-flex'>
												<label className='col-md-6'>
													Cấm QC:
												</label>
												<div className='col-md-3'>
													{camqc}
												</div>
											</div>
											<div className='d-flex'>
												<label className='col-md-6'>
													Bắt buộc verimail:
												</label>
												<div className='col-md-3'>
													{batbuocverimail}
												</div>
											</div>
										</div>
										<div className='col-md-6'>
											<div className='d-flex'>
												<label className='col-md-6'>
													Link không hoạt động:
												</label>
												<div className='col-md-3'>
													{link_khonghoatdong}
												</div>
											</div>
											<div className='d-flex'>
												<label className='col-md-6'>
													BM 250:
												</label>
												<div className='col-md-3'>
													{bm250}
												</div>
											</div>
											<div className='d-flex'>
												<label className='col-md-6'>
													Chưa tạo QC:
												</label>
												<div className='col-md-3'>
													{chuatkqc}
												</div>
											</div>
											<div className='d-flex'>
												<label className='col-md-6'>
													Không cấm QC:
												</label>
												<div className='col-md-3'>
													{khongcamqc}
												</div>
											</div>
											<div className='d-flex'>
												<label className='col-md-6'>
													Không bắt buộc verimail:
												</label>
												<div className='col-md-3'>
													{khongbatbuocverimail}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className='form-group'>{listBM}</div>
						</div>
					</div>
				</div>
			</Fragment>
		)
	}
}

const mapStateToProps = (state) => ({
	error: state.error,
	auth: state.auth,
	item: state.item,
})

export default connect(mapStateToProps, { cLinkBM, cIDBM })(CheckBm)
