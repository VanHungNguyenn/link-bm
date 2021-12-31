import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux'

import { updateUserInfo, saveDataUser } from '../../actions/authActions'

class info_user extends Component {
	state = {}

	componentDidMount() {
		const { _id, phone } = this.props.auth.user
		const { edituser } = this.props.auth
		var new_edituser = {
			...edituser,
			_id: _id,
			phone: phone,
		}
		this.props.updateUserInfo(new_edituser)
	}

	ChangeInfoUser = (e) => {
		const { edituser } = this.props.auth
		var new_edituser = {
			...edituser,
			[e.target.name]: e.target.value,
		}
		this.props.updateUserInfo(new_edituser)
	}

	onKeyPress = (e) => {
		if (!(e.charCode >= 48 && e.charCode <= 57)) {
			e.preventDefault()
		}
	}

	render() {
		const { name, key } = this.props.auth.user

		const { phone, old_pass, new_pass, re_pass } = this.props.auth.edituser
		return (
			<Fragment>
				<div className='content'>
					<div className='block block-rounded block-bordered'>
						<div className='block-header block-header-default border-bottom'>
							<h3 className='block-title'>Thông tin cá nhân</h3>
						</div>
						<div className='block-content'>
							<p>
								<b>Secret key: </b>
								<span>{key}</span>
							</p>

							<div className='row form-group'>
								<div className='col-md-4'>
									<label className='mt-2'>
										Tên tài khoản:
									</label>
								</div>
								<div className='col-md-8'>
									<input
										disabled
										type='text'
										className='form-control'
										value={name}
									/>
								</div>
							</div>
							<div className='row form-group'>
								<div className='col-md-4'>
									<label className='mt-2'>
										Số điện thoại:
									</label>
								</div>
								<div className='col-md-8'>
									<input
										name='phone'
										type='text'
										className='form-control'
										onKeyPress={this.onKeyPress}
										onChange={(e) => {
											this.ChangeInfoUser(e)
										}}
										value={phone}
									/>
								</div>
							</div>
							<div className='row form-group'>
								<div className='col-md-4'>
									<label className='mt-2'>Mật khẩu cũ:</label>
								</div>
								<div className='col-md-8'>
									<input
										autoComplete='new-password'
										name='old_pass'
										type='password'
										className='form-control'
										onChange={(e) => {
											this.ChangeInfoUser(e)
										}}
										value={old_pass}
									/>
								</div>
							</div>

							<div className='row form-group'>
								<div className='col-md-4'>
									<label className='mt-2'>
										Mật khẩu mới:
									</label>
								</div>
								<div className='col-md-8'>
									<input
										autoComplete='new-password'
										name='new_pass'
										type='password'
										className='form-control'
										onChange={(e) => {
											this.ChangeInfoUser(e)
										}}
										value={new_pass}
									/>
								</div>
							</div>

							<div className='row form-group'>
								<div className='col-md-4'>
									<label className='mt-2'>
										Nhập lại mật khẩu mới:
									</label>
								</div>
								<div className='col-md-8'>
									<input
										autoComplete='new-password'
										name='re_pass'
										type='password'
										className='form-control'
										onChange={(e) => {
											this.ChangeInfoUser(e)
										}}
										value={re_pass}
									/>
								</div>
							</div>

							<div className='row mt-4'>
								<div className='col-md-12'>
									<div className='form-group float-right w-100'>
										<button
											onClick={() => {
												this.props.saveDataUser(
													this.props.auth.edituser
												)
											}}
											type='button'
											className='btn btn-hero-primary btn-rounded btn-block'
										>
											Lưu
										</button>
									</div>
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
export default connect(mapStateToProps, { updateUserInfo, saveDataUser })(
	info_user
)
