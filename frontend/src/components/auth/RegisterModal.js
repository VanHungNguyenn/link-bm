import React, { Component, Fragment } from 'react'
import {
	BrowserRouter as Router,
	// Switch,
	// Route,
	Link,
} from 'react-router-dom'
import { Alert } from 'reactstrap'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { register } from '../../actions/authActions'
import { clearErrors } from '../../actions/errorActions'
import Swal from 'sweetalert2'

class RegisterModal extends Component {
	state = {
		// modal: false,
		name: '',
		phone: '',
		password: '',
		repeatpassword: '',
		msg: null,
	}

	static propTypes = {
		isAuthenticated: PropTypes.bool,
		error: PropTypes.object.isRequired,
		register: PropTypes.func.isRequired,
		clearErrors: PropTypes.func.isRequired,
	}

	componentDidUpdate(prevProps) {
		const { error } = this.props
		if (error !== prevProps.error) {
			// Check for register error
			if (error.id === 'REGISTER_FAIL') {
				Swal.fire(error.msg.msg, '', 'error')
				this.clearAlert()
			} else if (error.id === 'REGISTER_SUCCESS') {
				Swal.fire(error.msg, '', 'success')
				this.clearAlert()
			}
		}

		// // If authenticated, close modal
		// if (this.state.modal) {
		// if (isAuthenticated) {
		// this.toggle();
		// }
		// }
	}

	// toggle = () => {
	// // Clear errors
	// this.props.clearErrors();
	// this.setState({
	// modal: !this.state.modal
	// });
	// }

	// changeToLogin = () => {
	// this.props.clearErrors();
	// this.setState({
	// modal: !this.state.modal
	// });

	// }

	clearAlert = () => {
		// Clear errors
		this.props.clearErrors()
		// this.setState({
		// modal: !this.state.modal
		// });
	}

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value })
	}

	onSubmit = (e) => {
		e.preventDefault()

		const { name, phone, password, repeatpassword } = this.state

		// Create user object
		const newUser = {
			name,
			phone,
			password,
			repeatpassword,
		}

		// Attempt to register
		this.props.register(newUser)
	}

	render() {
		// const domainSite = window.location.hostname
		return (
			<Router>
				<Fragment>
					<div className='block block-rounded block-bordered'>
						<div className='block-header block-header-default'>
							<h3 className='block-title'>????ng k??</h3>
						</div>
						<div className='block-content block-content-full bg-white'>
							<div className='mb-2 text-center'>
								{/* <a className="link-fx font-w700 font-size-h1" href="index.html">
								<span className="text-dark text-uppercase">{domainSite.slice(0, domainSite.lastIndexOf('.'))}</span>
								<span className="text-dark text-uppercase">{domainSite.indexOf('.') > -1 ? domainSite.slice(domainSite.lastIndexOf('.')) : ''}</span>
							</a>
							<p className="text-uppercase font-w700 font-size-sm text-muted">T???o t??i kho???n</p> */}
							</div>
							{this.state.msg ? (
								<Alert color='danger'>{this.state.msg}</Alert>
							) : null}
							<form
								className='js-validation-signup user'
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
											placeholder='T??n t??i kho???n'
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
											type='text'
											className='form-control form-control-user'
											id='phone'
											name='phone'
											placeholder='S??? ??i???n tho???i'
											onChange={this.onChange}
										/>
										<div className='input-group-append'>
											<span className='input-group-text'>
												<i className='fa fa-envelope-open'></i>
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
											placeholder='M???t kh???u'
											onChange={this.onChange}
										/>
										<div className='input-group-append'>
											<span className='input-group-text'>
												<i className='fa fa-asterisk'></i>
											</span>
										</div>
									</div>
								</div>
								<div className='form-group'>
									<div className='input-group'>
										<input
											type='password'
											className='form-control form-control-user'
											id='repeatpassword'
											name='repeatpassword'
											placeholder='Nh???p l???i m???t kh???u'
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
										className='btn btn-hero-primary'
									>
										????ng k??
									</button>
								</div>
							</form>
						</div>
						<div className='block-content bg-body'>
							<div className='d-flex justify-content-center text-center push'>
								<div className='font-w600 font-size-sm py-1 text-center'>
									B???n c?? t??i kho???n?{' '}
									<Link
										to='/'
										className='small'
										onClick={this.props.action}
									>
										????ng nh???p!
									</Link>
								</div>
							</div>
						</div>
					</div>
				</Fragment>
			</Router>
		)
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	error: state.error,
})

export default connect(mapStateToProps, { register, clearErrors })(
	RegisterModal
)
