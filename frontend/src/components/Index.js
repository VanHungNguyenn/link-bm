import React, { Component, Fragment } from 'react'
// import {
// Collapse,
// Navbar,
// NavbarToggler,
// NavbarBrand,
// Nav,
// NavItem,
// NavLink,
// Container
// } from 'reactstrap';
import { connect } from 'react-redux'
import ProTypes from 'prop-types'
// import RegisterModal from './auth/RegisterModal';
import LoginModal from './auth/LoginModal'
// import Logout from './auth/Logout';
import Backend from './Backend'
// import store from '../store';
// import { loadUser } from '../actions/authActions';
import MessengerCustomerChat from 'react-messenger-customer-chat'

class AppNavbar extends Component {
	state = {
		// isOpen: false
	}

	static propTypes = {
		auth: ProTypes.object.isRequired,
	}

	render() {
		const { isAuthenticated /*token*/ } = this.props.auth
		let comp

		const authLinks = (
			<Fragment>
				<Backend />
			</Fragment>
		)

		const guestLinks = (
			<Fragment>
				<LoginModal />
			</Fragment>
		)

		if (isAuthenticated) {
			comp = authLinks
		} else {
			comp = guestLinks
		}

		return (
			<Fragment>
				{comp}
				<MessengerCustomerChat
					pageId='104192042124971'
					appId='957747331501187'
				/>
			</Fragment>
		)
	}
}

const mapStateToProps = (state) => ({
	auth: state.auth,
})

export default connect(mapStateToProps, null)(AppNavbar)
