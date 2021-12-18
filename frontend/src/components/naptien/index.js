import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux'

class NapTien extends Component {
	state = {
		copySuccessNapTienVCB: false,
		copySuccessNapTienMomo: false,
	}

	copyToClipboardNapTienVCB = (final_data) => {
		var dummy = document.createElement('textarea')
		document.body.appendChild(dummy)
		dummy.value = final_data
		dummy.select()
		document.execCommand('copy')
		document.body.removeChild(dummy)
		this.setState({ copySuccessNapTienVCB: true })
	}

	copyToClipboardNapTienMomo = (final_data) => {
		var dummy = document.createElement('textarea')
		document.body.appendChild(dummy)
		dummy.value = final_data
		dummy.select()
		document.execCommand('copy')
		document.body.removeChild(dummy)
		this.setState({ copySuccessNapTienMomo: true })
	}

	render() {
		const { user } = this.props.auth

		return (
			<Fragment>
				<div className='content'>
					<div className='block block-rounded block-bordered'>
						<div className='row'>
							<div className='col-lg-6'>
								<div
									style={{
										textAlign: 'center',
										paddingTop: '2%',
									}}
								>
									<img
										src='/vietcombank-logo.jpg'
										style={{ width: '30%' }}
										alt=''
									/>
									<div className='pt-2'>
										<p>
											Số tài khoản :{' '}
											<strong className='text-danger'>
												19032725317018
											</strong>
										</p>
										<p>
											Tên tài khoản :{' '}
											<strong className='text-danger'>
												LE BACH HIEP
											</strong>{' '}
										</p>
										<p>
											Ngân hàng :{' '}
											<strong className='text-danger'>
												TECHCOMBANK
											</strong>
										</p>
										<p
											style={{
												display: 'inline-block',
												marginRight: '10px',
											}}
										>
											Nội dung :{' '}
											<strong className='text-danger'>
												golike {user.name}
											</strong>
										</p>
										{this.state.copySuccessNapTienVCB ===
										true ? (
											<Fragment>
												<button
													className='btn btn-success'
													style={{
														'margin-left': '3px',
													}}
													onClick={() => {
														this.copyToClipboardNapTienVCB(
															'golike ' +
																user.name
														)
													}}
												>
													Đã copy{' '}
													<i className='fa fa-fw fa-check'></i>
												</button>
											</Fragment>
										) : (
											<Fragment>
												<button
													className='btn btn-warning'
													style={{
														'margin-left': '3px',
													}}
													onClick={() => {
														this.copyToClipboardNapTienVCB(
															'golike ' +
																user.name
														)
													}}
												>
													Copy
												</button>
											</Fragment>
										)}
										{/* <p>Tên tài khoản của bạn là : <strong className="text-danger"> {user.name}</strong></p>
									   <p><strong><strong className="text-danger">Chuyển khoản sai nội dung sẽ mất đến 48h để xử lý!
										  </strong></strong>
									   </p>
									   <p><strong><strong className="text-danger"><strong><strong className="text-danger">Không hoàn lại số tiền nạp vào hệ thống với bất kì lý do nào!
										  </strong></strong></strong></strong>
									   </p> */}
									</div>
								</div>
							</div>
							<div className='col-lg-6'>
								<div
									style={{
										textAlign: 'center',
										paddingTop: '2%',
									}}
								>
									<img
										src='/momo.png'
										style={{ width: '30%' }}
										alt=''
									/>
									<div className='pt-2'>
										<p>
											Số điện thoại :{' '}
											<strong className='text-danger'>
												0829999181
											</strong>{' '}
										</p>
										<p>
											Tên người nhận :{' '}
											<strong className='text-danger'>
												LE BACH HIEP
											</strong>
										</p>
										<p>
											Ví điện tử :{' '}
											<strong className='text-danger'>
												MOMO
											</strong>
										</p>
										<p
											style={{
												display: 'inline-block',
												marginRight: '10px',
											}}
										>
											Nội dung :{' '}
											<strong className='text-danger'>
												golike {user.name}
											</strong>
										</p>
										{this.state.copySuccessNapTienMomo ===
										true ? (
											<Fragment>
												<button
													className='btn btn-success'
													style={{
														'margin-left': '3px',
													}}
													onClick={() => {
														this.copyToClipboardNapTienMomo(
															'golike ' +
																user.name
														)
													}}
												>
													Đã copy{' '}
													<i className='fa fa-fw fa-check'></i>
												</button>
											</Fragment>
										) : (
											<Fragment>
												<button
													className='btn btn-warning'
													style={{
														'margin-left': '3px',
													}}
													onClick={() => {
														this.copyToClipboardNapTienMomo(
															'golike ' +
																user.name
														)
													}}
												>
													Copy
												</button>
											</Fragment>
										)}
										{/* <p>Tên tài khoản của bạn là : <strong className="text-danger"> {user.name}</strong></p>
									    <p><strong><strong className="text-danger">Chuyển khoản sai nội dung sẽ mất đến 48h để xử lý!
										  </strong></strong>
									   </p>
									   <p><strong><strong className="text-danger"><strong><strong className="text-danger">Không hoàn lại số tiền nạp vào hệ thống với bất kì lý do nào!
										  </strong></strong></strong></strong>
									   </p> */}
									</div>
								</div>
							</div>
							<div className='col-lg-12'>
								<div
									style={{
										textAlign: 'center',
										paddingTop: '2%',
									}}
								>
									<div className='pt-2'>
										<p>
											<strong>
												<strong className='text-danger'>
													Chuyển khoản sai nội dung sẽ
													mất đến 48h để xử lý!
												</strong>
											</strong>
										</p>
										<p>
											<strong>
												<strong className='text-danger'>
													<strong>
														<strong className='text-danger'>
															Không hoàn lại số
															tiền nạp vào hệ
															thống với bất kì lý
															do nào!
														</strong>
													</strong>
												</strong>
											</strong>
										</p>
									</div>
								</div>
							</div>
							<div className='col-lg-12'>
								<div className='col-md-12 alert alert-info'>
									<strong>
										Lưu ý 1: Bạn phải ghi đúng nội dung
										chuyển khoản như bên trên golike[dấu
										cách]Tên tài khoản. Bất cứ sai sót nào
										cũng có thể dẫn đến mất tiền (nạp sai cú
										pháp phí trừ nạp sai 10% số tiền nạp).
									</strong>
									<p></p>
									<strong>
										<strong className='text-danger'>
											Lưu ý 2: Nạp tiền sau 22h có thể bị
											update chậm trễ. Vui lòng nạp tiền
											trước 22h hoặc chờ sáng hôm sau được
											update tiền trên hệ thống.
										</strong>
										<p></p>
									</strong>
									<strong>
										Lưu ý 3: Các trường hợp cần khẩn cấp vui
										lòng inbox Zalo hoặc gọi trực tiếp số
										0968 099 960 để được hỗ trợ nhanh nhất.
									</strong>
								</div>
							</div>
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

export default connect(mapStateToProps, {})(NapTien)
