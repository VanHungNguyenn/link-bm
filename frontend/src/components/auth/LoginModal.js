import React, { Component, Fragment } from 'react'
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	NavLink,
} from 'react-router-dom'
import {
	// Button,
	// Modal,
	// ModalHeader,
	// ModalBody,
	// Form,
	// FormGroup,
	// Label,
	// Input,
	// NavLink,
	Alert,
} from 'reactstrap'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { login } from '../../actions/authActions'
import { clearErrors } from '../../actions/errorActions'
import RegisterModal from './RegisterModal'
import Swal from 'sweetalert2'
import store from '../../store'
import { loadUser } from '../../actions/authActions'
import TrangChu from '../trangchu/'
import LienHe from '../lienhe/index'

class LoginModal extends Component {
	state = {
		modal: false,
		name: '',
		password: '',
		msg: null,
		menuDropdown: '',
	}

	static propTypes = {
		isAuthenticated: PropTypes.bool,
		error: PropTypes.object.isRequired,
		login: PropTypes.func.isRequired,
		clearErrors: PropTypes.func.isRequired,
	}

	componentDidUpdate(prevProps) {
		const { error, isAuthenticated } = this.props
		if (error !== prevProps.error) {
			// Check for login error
			if (error.id === 'LOGIN_FAIL') {
				Swal.fire(error.msg.msg, '', 'error')
			} else if (error.id === 'LOGIN_SUCCESS') {
				Swal.fire(error.msg.msg, '', 'success')
			}
		}

		// If authenticated, close modal
		if (this.state.modal) {
			if (isAuthenticated) {
				this.clearAlert()
			}
		}
	}

	clearAlert = () => {
		// Clear errors
		this.props.clearErrors()
		// this.setState({
		// modal: !this.state.modal
		// });
	}

	changeFormLogRegister = () => {
		this.props.clearErrors()
		this.setState({
			modal: !this.state.modal,
		})
	}

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value })
	}

	onSubmit = (e) => {
		e.preventDefault()

		const { name, password } = this.state

		// Create user object
		const user = {
			name,
			password,
		}

		// Attempt to login
		this.props.login(user)
	}

	dropdownMenu(type) {
		this.setState({ menuDropdown: type })
	}

	dropdownMenuBlur(e) {
		if (e.relatedTarget === null) {
			this.setState({ menuDropdown: '' })
		} else {
			if (e.relatedTarget.className === 'dropdown-item') {
				return false
			} else {
				this.setState({ menuDropdown: '' })
			}
		}
	}

	render() {
		const domainSite = window.location.hostname

		var notifi = this.props.item.notifi
		var thongbao = ''
		if (notifi.thongbao !== '') {
			thongbao = (
				<div className='alert alert-primary' role='alert'>
					<p className='mb-0'>
						Thông báo từ Admin: {notifi.thongbao}!
					</p>
				</div>
			)
		}

		var tabuser = (
			<Fragment>
				<li className='nav-item'>
					<NavLink
						to='#'
						// activeClassName='active'
						className='nav-link text-body-color py-4'
						id='tabKey'
						onClick={() => {
							this.dropdownMenu('')
						}}
					>
						<i className='nav-main-link-icon si si-home text-gray'></i>
						<span className='d-none d-md-inline ml-1'>
							Trang chủ
						</span>
					</NavLink>
				</li>
				<li className='nav-item dropdown'>
					<Link
						to='/'
						// activeClassName='active'
						id='contact'
						className='nav-link text-body-color py-4'
						onClick={() => {
							this.dropdownMenu('show')
						}}
						onBlur={(e) => {
							this.dropdownMenuBlur(e)
						}}
					>
						<i className='nav-main-link-icon si si-users text-gray'></i>
						<span className='d-none d-md-inline ml-1'>Liên hệ</span>
					</Link>
					<div
						className={'dropdown-menu ' + this.state.menuDropdown}
						aria-labelledby='dropdown-default-primary'
						x-placement='bottom-start'
					>
						<a
							rel='noopener noreferrer'
							className='dropdown-item'
							// href={notifi.link_group_fb}
							href='https://www.facebook.com/groups/1151714455363837'
							target='_blank'
						>
							Vào nhóm facebook
						</a>
						<a
							rel='noopener noreferrer'
							className='dropdown-item'
							// href={notifi.link_group_zalo}
							href='https://zalo.me/g/jwxpuj071'
							target='_blank'
						>
							Vào nhóm zalo
						</a>
						<a
							rel='noopener noreferrer'
							className='dropdown-item'
							// href={notifi.link_group_tele}
							href='https://t.me/hotrotk24h/2'
							target='_blank'
						>
							Vào nhóm tele
						</a>
						<a
							rel='noopener noreferrer'
							className='dropdown-item'
							href={notifi.link_backup}
						>
							Link backup via
						</a>
					</div>
				</li>
			</Fragment>
		)

		var formLogin = (
			<Router>
				<Fragment>
					<h1 style={{ fontSize: '25px', textAlign: 'center' }}>
						HỆ THỐNG TK24H.COM MUA BÁN TÀI KHOẢN QUẢNG CÁO (VIA,
						CLONE, BM, HOTMAIL, GMAIL...) FACEBOOK GIÁ RẺ, UY TÍN
						NHẤT VIỆT NAM
					</h1>
					<div className='block block-rounded block-bordered'>
						<div className='block-header block-header-default'>
							<h3 className='block-title'>Đăng nhập</h3>
						</div>
						<div
							className='block-content block-content-full  bg-white'
							style={{ padding: '20px !important' }}
						>
							<div className='mb-2 text-center'>
								{/* <a className="link-fx font-w700 font-size-h1" href="index.html">
									<span className="text-dark text-uppercase">{domainSite.slice(0, domainSite.lastIndexOf('.'))}</span>
									<span className="text-dark text-uppercase">{domainSite.indexOf('.') > -1 ? domainSite.slice(domainSite.lastIndexOf('.')) : ''}</span>
								</a>
								<p className="text-uppercase font-w700 font-size-sm text-muted">Đăng nhập</p> */}
							</div>
							{this.state.msg ? (
								<Alert color='danger'>{this.state.msg}</Alert>
							) : null}
							<form
								className='js-validation-signin user'
								onSubmit={this.onSubmit}
								style={{ padding: '0px 10% 0px 10%' }}
							>
								<div className='form-group'>
									<div className='input-group'>
										<input
											type='text'
											className='form-control form-control-user'
											id='name'
											name='name'
											aria-describedby='emailHelp'
											placeholder='Tên tài khoản'
											onChange={this.onChange}
										/>
										<div className='input-group-append'>
											<span className='input-group-text'>
												<i className='fa fa-user-circle'></i>
											</span>
										</div>
									</div>
								</div>
								<div className='form-group'>
									<div className='input-group'>
										<input
											type='password'
											className='form-control form-control-user'
											id='password'
											name='password'
											placeholder='Mật khẩu'
											onChange={this.onChange}
										/>
										<div className='input-group-append'>
											<span className='input-group-text'>
												<i className='fa fa-asterisk'></i>
											</span>
										</div>
									</div>
								</div>
								<div className='form-group text-center'>
									<button
										onClick={this.clearAlert}
										type='submit'
										className='btn btn-hero-primary'
									>
										<i className='fa fa-fw fa-sign-in-alt mr-1'></i>{' '}
										Đăng nhập
									</button>
								</div>
							</form>
						</div>
						<div className='block-content bg-body'>
							<div className='d-flex justify-content-center text-center push'>
								<div className='font-w600 font-size-sm py-1 text-center'>
									Chưa có tài khoản?{' '}
									<Link
										to='/'
										className='small'
										onClick={this.changeFormLogRegister}
									>
										Tạo tài khoản!
									</Link>
								</div>
							</div>
						</div>
					</div>
				</Fragment>
			</Router>
		)

		var formRegister = (
			<Fragment>
				<RegisterModal action={this.changeFormLogRegister} />
			</Fragment>
		)

		return (
			<Router>
				<Fragment>
					<div
						id='page-container'
						className='page-header-dark main-content-boxed side-trans-enabled'
					>
						<header id='page-header'>
							<div className='content-header'>
								<div>
									<Link
										className='link-fx font-size-lg text-dual'
										to='/'
									>
										<span className='font-w300 text-dual text-uppercase'>
											{domainSite}
										</span>
									</Link>
								</div>
							</div>
							<div
								id='page-header-loader'
								className='overlay-header bg-primary-darker'
							>
								<div className='content-header'>
									<div className='w-100 text-center'>
										<i className='fa fa-fw fa-2x fa-sun fa-spin text-white'></i>
									</div>
								</div>
							</div>
						</header>
						<main id='main-container'>
							<div className='bg-white border-bottom'>
								<div className='content py-0'>
									<ul className='nav nav-tabs nav-tabs-alt border-bottom-0 justify-content-center justify-content-md-start'>
										{tabuser}
									</ul>
								</div>
							</div>
							<div className='content'>{thongbao}</div>
							<div className='content'>
								{this.props.auth.user == null
									? this.state.modal
										? formRegister
										: formLogin
									: ''}
							</div>
							<TrangChu />
						</main>
						<footer
							id='page-footer'
							className='bg-white border-top'
						>
							<div className='content py-0'>
								<div className='row font-size-sm'>
									<div className='col-sm-6 order-sm-1 text-center text-sm-left'>
										<a
											className='font-w600 text-uppercase'
											href={'https://' + domainSite}
											target='_blank'
										>
											{domainSite}
										</a>{' '}
										©{' '}
										<span
											data-toggle='year-copy'
											className='js-year-copy-enabled'
										>
											2020
										</span>
									</div>
								</div>
							</div>
						</footer>
					</div>
				</Fragment>
			</Router>
		)
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	error: state.error,
	auth: state.auth,
	item: state.item,
})

export default connect(mapStateToProps, { login, clearErrors })(LoginModal)
