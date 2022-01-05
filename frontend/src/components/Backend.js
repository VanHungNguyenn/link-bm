import React, { Component, Fragment } from 'react'
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	NavLink,
} from 'react-router-dom'
// import { Container, ListGroup, ListGroupItem, Button } from 'reactstrap';
// import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux'
import { isMobile } from 'react-device-detect'
// import { getItems, deleteItem } from '../actions/itemActions';
import Logout from './auth/Logout'
// import PropTypes from 'prop-types';
import {
	loadUser,
	changeSidebar,
	changeMenuProfile,
} from '../actions/authActions'
import {
	getItems,
	layThongBaoClient,
	layThongBaoNapTien,
	layGiaoDich,
} from '../actions/itemActions'
import { clearErrors } from '../actions/errorActions'
import store from '../store'
import TrangChu from './trangchu/'
import LichSuMua from './lichsumua/'
import LichSuNapTien from './lichsunaptien/'
import Quanlytaikhoan from './Quanlytaikhoan/'
import LoaiSanPham from './loaisanpham/'
import SanPham from './sanpham/'
import SanPhamLoi from './sanphamloi/'
import NapTien from './naptien/'
import CheckBm from './checkbm/'
import GetOtp from './getotp/'
import InfoUser from './infouser/'
import SoDu from './sodu/'
import LienHe from './lienhe/index'
import LichSu from './lichsu/index'
import GetAPI from './getAPI'

import AdminLichSuMua from './admin/lichsumua/'
import AdminLichSuNap from './admin/lichsunaptien/'
import AdminTongDoanhThu from './admin/tongdoanhthu/'
import AdminThongBao from './admin/notifi/'
import GetAPIAdmin from './admin/getAPIAdmin'

import NumberFormat from 'react-number-format'
import moment from 'moment'
import parse from 'html-react-parser'
import socketIOClient from 'socket.io-client'
import '../css/tien.css'
import Swal from 'sweetalert2'

var socket = ''
class Index extends Component {
	// onDeleteClick = id => {
	// this.props.deleteItem(id);
	// }
	state = {
		adminAdtive: false,
		menuDropdown: '',
	}
	componentDidMount() {
		var url = window.location.href
		if (url.search('/admin/') !== -1) {
			this.setState({ adminAdtive: true })
		}
		this.props.getItems()
		this.props.layThongBaoClient()
		var that = this
		setInterval(function () {
			that.props.layThongBaoNapTien()
		}, 60000)
	}
	dropdownMenu(type) {
		this.setState({ menuDropdown: type })
	}
	dropdownMenuBlur(e) {
		if (e.relatedTarget === null) {
			this.setState({ menuDropdown: '' })
			this.props.changeMenuProfile(false)
		} else {
			if (
				e.relatedTarget.className === 'dropdown-item' ||
				e.relatedTarget.className === 'dropdown-item mb-0'
			) {
				return false
			} else {
				this.setState({ menuDropdown: '' })
				this.props.changeMenuProfile(false)
			}
		}
	}
	componentDidUpdate(prevProps) {
		if (this.props.error.status === 200) {
			this.props.clearErrors()
			if (this.props.error.id === 'MUA_TK_SUCCESS') {
				Swal.fire(this.props.error.msg, '', 'success').then(
					(result) => {}
				)
			} else if (this.props.error.id === 'GIAO_DICH_SUCCESS') {
				Swal.fire(this.props.error.msg, '', 'success').then(
					(result) => {
						if (result.value) {
							document.getElementById('lichsumua').click()
						}
					}
				)
			} else {
				Swal.fire(this.props.error.msg, '', 'success')
			}
		} else if (this.props.error.status === 400) {
			Swal.fire(this.props.error.msg, '', 'error')
			this.props.clearErrors()
		}
	}
	onClickSidebar = (isOpen) => {
		this.props.changeSidebar(!isOpen)
	}
	onClickMenu = (isOpen) => {
		this.props.changeMenuProfile(!isOpen)
	}
	adminAdtive = (type) => {
		this.setState({
			adminAdtive: !type,
		})
		this.props.changeMenuProfile(false)
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
		const domainSite = window.location.hostname
		// const { items } = this.props.item;
		const { user } = this.props.auth
		var notifi = this.props.item.notifi
		var date_now = Math.round(Date.now() / 1000)
		var date = date_now + 1 * 60 * 60 * 24
		var tabadmin = ''
		var tabuser = ''
		var img_user = '/avatar12.jpg'
		tabadmin = (
			<Fragment>
				<li className='nav-item'>
					<NavLink
						to='/admin/user'
						// activeClassName='active'
						className='nav-link text-body-color py-4'
						id='tabKey'
						onClick={() => {
							store.dispatch(loadUser())
							if (isMobile) {
								this.onClickSidebar(
									this.props.auth.isOpenSidebar
								)
							}
						}}
					>
						<i className='nav-main-link-icon si si-users text-gray'></i>
						<span className='d-none d-md-inline ml-1'>
							Quản lý tài khoản
						</span>
					</NavLink>
				</li>
				<li className='nav-item'>
					<NavLink
						to='/admin/loaisanpham'
						// activeClassName='active'
						className='nav-link text-body-color py-4'
						onClick={() => {
							store.dispatch(loadUser())
							if (isMobile) {
								this.onClickSidebar(
									this.props.auth.isOpenSidebar
								)
							}
						}}
					>
						<i className='nav-main-link-icon si si-briefcase text-gray'></i>
						<span className='d-none d-md-inline ml-1'>
							Loại sản phẩm
						</span>
					</NavLink>
				</li>
				<li className='nav-item'>
					<NavLink
						to='/admin/sanpham'
						// activeClassName='active'
						className='nav-link text-body-color py-4'
						onClick={() => {
							store.dispatch(loadUser())
							if (isMobile) {
								this.onClickSidebar(
									this.props.auth.isOpenSidebar
								)
							}
						}}
					>
						<i className='nav-main-link-icon si si-doc text-gray'></i>
						<span className='d-none d-md-inline ml-1'>
							Sản phẩm
						</span>
					</NavLink>
				</li>
				<li className='nav-item'>
					<NavLink
						to='/admin/sanphamloi'
						// activeClassName='active'
						className='nav-link text-body-color py-4'
						onClick={() => {
							store.dispatch(loadUser())
							if (isMobile) {
								this.onClickSidebar(
									this.props.auth.isOpenSidebar
								)
							}
						}}
					>
						<i className='nav-main-link-icon si si-doc text-gray'></i>
						<span className='d-none d-md-inline ml-1'>
							Mua sản phẩm lỗi
						</span>
					</NavLink>
				</li>
				<li className='nav-item'>
					<NavLink
						to='/admin/getapi'
						// activeClassName='active'
						id='api'
						className='nav-link text-body-color py-4'
						// onClick={() => {
						// 	this.dropdownMenu('')
						// 	store.dispatch(loadUser())
						// 	if (isMobile) {
						// 		this.onClickSidebar(
						// 			this.props.auth.isOpenSidebar
						// 		)
						// 	}
						// }}
					>
						<i className='nav-main-link-icon fas fa-tape text-gray'></i>
						<span className='d-none d-md-inline ml-1'>API</span>
					</NavLink>
				</li>
				<li className='nav-item'>
					<NavLink
						to='/admin/historybuy'
						// activeClassName='active'
						className='nav-link text-body-color py-4'
						onClick={() => {
							store.dispatch(loadUser())
							if (isMobile) {
								this.onClickSidebar(
									this.props.auth.isOpenSidebar
								)
							}
						}}
					>
						<i className='nav-main-link-icon si si-book-open text-gray'></i>
						<span className='d-none d-md-inline ml-1'>
							Lịch sử mua
						</span>
					</NavLink>
				</li>
				<li className='nav-item'>
					<NavLink
						to='/admin/historydeposit'
						// activeClassName='active'
						className='nav-link text-body-color py-4'
						onClick={() => {
							store.dispatch(loadUser())
							if (isMobile) {
								this.onClickSidebar(
									this.props.auth.isOpenSidebar
								)
							}
						}}
					>
						<i className='nav-main-link-icon si si-wallet text-gray'></i>
						<span className='d-none d-md-inline ml-1'>
							Lịch sử nạp tiền
						</span>
					</NavLink>
				</li>
				<li className='nav-item'>
					<NavLink
						to='/admin/tongdoanhthu'
						// activeClassName='active'
						className='nav-link text-body-color py-4'
						onClick={() => {
							store.dispatch(loadUser())
							if (isMobile) {
								this.onClickSidebar(
									this.props.auth.isOpenSidebar
								)
							}
						}}
					>
						<i className='nav-main-link-icon si si-chart text-gray'></i>
						<span className='d-none d-md-inline ml-1'>
							Tổng doanh thu
						</span>
					</NavLink>
				</li>
				<li className='nav-item'>
					<NavLink
						to='/admin/notifi'
						// activeClassName='active'
						className='nav-link text-body-color py-4'
						onClick={() => {
							store.dispatch(loadUser())
							if (isMobile) {
								this.onClickSidebar(
									this.props.auth.isOpenSidebar
								)
							}
						}}
					>
						<i className='nav-main-link-icon si si-settings text-gray'></i>
						<span className='d-none d-md-inline ml-1'>Config</span>
					</NavLink>
				</li>
			</Fragment>
		)
		tabuser = (
			<Fragment>
				<li className='nav-item'>
					<NavLink
						to='/'
						// activeClassName='active'
						className='nav-link text-body-color py-4'
						id='tabKey'
						onClick={() => {
							this.dropdownMenu('')
							store.dispatch(loadUser())
							if (isMobile) {
								this.onClickSidebar(
									this.props.auth.isOpenSidebar
								)
							}
						}}
					>
						<i className='nav-main-link-icon si si-home text-gray'></i>
						<span className='d-none d-md-inline ml-1'>
							Trang chủ
						</span>
					</NavLink>
				</li>
				<li className='nav-item'>
					<NavLink
						to='/naptien'
						// activeClassName='active'
						className='nav-link text-body-color py-4'
						onClick={() => {
							this.dropdownMenu('')
							store.dispatch(loadUser())
							if (isMobile) {
								this.onClickSidebar(
									this.props.auth.isOpenSidebar
								)
							}
						}}
					>
						<i className='nav-main-link-icon si si-wallet text-gray'></i>
						<span className='d-none d-md-inline ml-1'>
							Nạp tiền
						</span>
					</NavLink>
				</li>
				<li className='nav-item'>
					<NavLink
						to='/getapi'
						// activeClassName='active'
						id='api'
						className='nav-link text-body-color py-4'
						// onClick={() => {
						// 	this.dropdownMenu('')
						// 	store.dispatch(loadUser())
						// 	if (isMobile) {
						// 		this.onClickSidebar(
						// 			this.props.auth.isOpenSidebar
						// 		)
						// 	}
						// }}
					>
						<i className='nav-main-link-icon fas fa-tape text-gray'></i>
						<span className='d-none d-md-inline ml-1'>API</span>
					</NavLink>
				</li>
				<li className='nav-item'>
					<NavLink
						to='/historybuy'
						// activeClassName='active'
						id='lichsumua'
						className='nav-link text-body-color py-4'
						onClick={() => {
							this.dropdownMenu('')
							store.dispatch(loadUser())
							if (isMobile) {
								this.onClickSidebar(
									this.props.auth.isOpenSidebar
								)
							}
						}}
					>
						<i className='nav-main-link-icon si si-book-open text-gray'></i>
						<span className='d-none d-md-inline ml-1'>
							Lịch sử mua
						</span>
					</NavLink>
				</li>
				<li className='nav-item'>
					<NavLink
						to='/historydeposit'
						// activeClassName='active'
						className='nav-link text-body-color py-4'
						onClick={() => {
							this.dropdownMenu('')
							store.dispatch(loadUser())
							if (isMobile) {
								this.onClickSidebar(
									this.props.auth.isOpenSidebar
								)
							}
						}}
					>
						<i className='nav-main-link-icon si si-wallet text-gray'></i>
						<span className='d-none d-md-inline ml-1'>
							Lịch sử nạp tiền
						</span>
					</NavLink>
				</li>
				{/* <li className='nav-item'>
					<NavLink
						to='/checkbm'
						// activeClassName='active'
						id='checkbm'
						className='nav-link text-body-color py-4'
						onClick={() => {
							this.dropdownMenu('')
							store.dispatch(loadUser())
							if (isMobile) {
								this.onClickSidebar(
									this.props.auth.isOpenSidebar
								)
							}
						}}
					>
						<i className='nav-main-link-icon si si-check text-gray'></i>
						<span className='d-none d-md-inline ml-1'>
							Check BM
						</span>
					</NavLink>
				</li> */}
				{/* <li className='nav-item'>
					<NavLink
						to='/getotp'
						// activeClassName='active'
						id='getotp'
						className='nav-link text-body-color py-4'
						onClick={() => {
							this.dropdownMenu('')
							store.dispatch(loadUser())
							if (isMobile) {
								this.onClickSidebar(
									this.props.auth.isOpenSidebar
								)
							}
						}}
					>
						<i className='nav-main-link-icon si si-check text-gray'></i>
						<span className='d-none d-md-inline ml-1'>
							Lấy mã OTP 2FA
						</span>
					</NavLink>
				</li> */}
				{/* <li className='nav-item'>
					<NavLink
						to='/lichsu'
						activeClassName='active'
						id='lichsu'
						className='nav-link text-body-color py-4'
						onClick={() => {
							this.dropdownMenu('')
							store.dispatch(loadUser())
							if (isMobile) {
								this.onClickSidebar(
									this.props.auth.isOpenSidebar
								)
							}
						}}
					>
						<i className='nav-main-link-icon si si-check text-gray'></i>
						<span className='d-none d-md-inline ml-1'>Lịch sử</span>
					</NavLink>
				</li> */}
				<li className='nav-item dropdown'>
					<Link
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
				<li className='nav-item'>
					<div
						// activeClassName='active'
						className='nav-link text-body-color py-4'
					>
						<i className='nav-main-link-icon si si-wallet text-gray'></i>
						<span className='d-none d-md-inline ml-1'>
							Số dư: {this.formatMoney(user.balance)} VNĐ
						</span>
					</div>
				</li>
			</Fragment>
		)
		var activeTab = ''
		if (user.role === 1) {
			activeTab = (
				<span
					className=''
					onClick={() => {
						this.adminAdtive(this.state.adminAdtive)
					}}
				>
					<Link
						className='dropdown-item mb-0'
						to={
							this.state.adminAdtive === false && user.role === 1
								? '/admin/user'
								: '/'
						}
					>
						<i className='fa fa-fw fa-cog text-gray mr-1'></i>
						{this.state.adminAdtive === false && user.role === 1
							? 'Chuyển đến trang Admin'
							: 'Chuyển đến trang người dùng'}
					</Link>
				</span>
			)
		}

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
								<div>
									<div className='dropdown d-inline-block'>
										<Link
											to=''
											className='btn btn-dual'
											id='page-header-user-dropdown'
											aria-haspopup='true'
											aria-expanded='false'
											onBlur={(e) => {
												this.dropdownMenuBlur(e)
											}}
											onClick={() => {
												store.dispatch(loadUser())
												this.onClickMenu(
													this.props.auth
														.isOpenMenuProfile
												)
											}}
										>
											<img
												className='img-avatar img-avatar32 img-avatar-thumb'
												src={img_user}
												alt=''
											/>
											<i className='fa fa-fw fa-angle-down ml-1'></i>
										</Link>
										<div
											className={
												'dropdown-menu dropdown-menu-right p-0' +
												(this.props.auth
													.isOpenMenuProfile
													? ' show open-menu-profile-custom'
													: '')
											}
											aria-labelledby='page-header-user-dropdown'
										>
											<div className='rounded-top font-w600 text-center p-3 border-bottom'>
												<img
													className='img-avatar img-avatar48'
													src={img_user}
													alt=''
												/>
												<div className='pt-2'></div>
												Username:{' '}
												<a
													className='font-w600 text-blue'
													href='#'
												>
													{user.name}
												</a>
												<div className='font-size-sm text-muted'>
													Số thứ tự: {user.stt}
												</div>
												<div className='font-size-sm text-muted'>
													Số điện thoại: {user.phone}
												</div>
											</div>
											<div className='p-2'>
												{activeTab}
											</div>
											<div className='p-2'>
												<span
													className=''
													onClick={() => {
														this.onClickMenu(
															this.props.auth
																.isOpenMenuProfile
														)
													}}
												>
													<Link
														className='dropdown-item mb-0'
														to='/infouser'
													>
														<i className='far fa-fw fa-user text-gray mr-1'></i>
														Thông tin tài khoản
													</Link>
												</span>
											</div>
											<div className='p-2'>
												<Logout />
											</div>
										</div>
									</div>
								</div>
							</div>
							<div
								id='page-header-search'
								className='overlay-header bg-primary'
							>
								<div className='content-header'>
									<form
										className='w-100'
										action='be_pages_generic_search.html'
										method='POST'
									>
										<div className='input-group'>
											<div className='input-group-prepend'>
												<button
													type='button'
													className='btn btn-primary'
													data-toggle='layout'
													data-action='header_search_off'
												>
													<i className='fa fa-fw fa-times-circle'></i>
												</button>
											</div>
											<input
												type='text'
												className='form-control border-0'
												placeholder='Search..'
												id='page-header-search-input'
												name='page-header-search-input'
											/>
										</div>
									</form>
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
										{this.state.adminAdtive === false
											? tabuser
											: ''}
										{this.state.adminAdtive === true &&
										user.role === 1
											? tabadmin
											: ''}
									</ul>
								</div>
							</div>
							<Switch>
								{this.state.adminAdtive === false && (
									<Route exact path='/'>
										<TrangChu />
									</Route>
								)}
								{/* {this.state.adminAdtive === false && (
									<Route exact path='/checkbm'>
										<CheckBm />
									</Route>
								)} */}
								{/* {this.state.adminAdtive === false && (
									<Route exact path='/getotp'>
										<GetOtp />
									</Route>
								)} */}
								{this.state.adminAdtive === false && (
									<Route exact path='/getapi'>
										{/* <GetOtp /> */}
										<GetAPI />
									</Route>
								)}
								{this.state.adminAdtive === false && (
									<Route exact path='/historybuy'>
										<LichSuMua />
									</Route>
								)}
								{this.state.adminAdtive === false && (
									<Route exact path='/historydeposit'>
										<LichSuNapTien />
									</Route>
								)}
								{this.state.adminAdtive === false && (
									<Route exact path='/naptien'>
										<NapTien />
									</Route>
								)}
								{this.state.adminAdtive === false && (
									<Route exact path='/lichsu'>
										<LichSu />
									</Route>
								)}

								{this.state.adminAdtive === false && (
									<Route exact path='/contact'>
										<LienHe />
									</Route>
								)}
								{this.state.adminAdtive === false && (
									<Route exact path='/sodu'>
										<SoDu />
									</Route>
								)}
								{this.state.adminAdtive === true &&
									user.role === 1 && (
										<Route exact path='/admin/user'>
											<Quanlytaikhoan />
										</Route>
									)}
								{this.state.adminAdtive === true &&
									user.role === 1 && (
										<Route exact path='/admin/loaisanpham'>
											<LoaiSanPham />
										</Route>
									)}
								{this.state.adminAdtive === true &&
									user.role === 1 && (
										<Route exact path='/admin/sanpham'>
											<SanPham />
										</Route>
									)}
								{this.state.adminAdtive === true &&
									user.role === 1 && (
										<Route exact path='/admin/sanphamloi'>
											<GetAPIAdmin />
										</Route>
									)}
								{this.state.adminAdtive === true &&
									user.role === 1 && (
										<Route exact path='/admin/getapi'>
											<SanPhamLoi />
										</Route>
									)}
								{this.state.adminAdtive === true &&
									user.role === 1 && (
										<Route exact path='/admin/historybuy'>
											<AdminLichSuMua />
										</Route>
									)}
								{this.state.adminAdtive === true &&
									user.role === 1 && (
										<Route
											exact
											path='/admin/historydeposit'
										>
											<AdminLichSuNap />
										</Route>
									)}
								{this.state.adminAdtive === true &&
									user.role === 1 && (
										<Route exact path='/admin/tongdoanhthu'>
											<AdminTongDoanhThu />
										</Route>
									)}
								{this.state.adminAdtive === true &&
									user.role === 1 && (
										<Route exact path='/admin/notifi'>
											<AdminThongBao />
										</Route>
									)}
								{
									<Route exact path='/infouser'>
										<InfoUser />
									</Route>
								}
							</Switch>
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
											2022
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

// Index.propTypes = {
// getItems: PropTypes.func.isRequired,
// item: PropTypes.object.isRequired
// }

const mapStateToProps = (state) => ({
	item: state.item,
	zalo: state.zalo,
	auth: state.auth,
	error: state.error,
})

// const mapDispatchToProps = { getItems, deleteItem };

export default connect(mapStateToProps, {
	changeSidebar,
	changeMenuProfile,
	getItems,
	clearErrors,
	layThongBaoClient,
	layThongBaoNapTien,
	layGiaoDich,
})(Index)
