import React, { Component, Fragment } from 'react';
// import { NavLink } from 'reactstrap';
import { connect } from 'react-redux';
import { logout } from '../../actions/authActions';
import ProTypes from 'prop-types';
import { Link } from 'react-router-dom';

export class Logout extends Component {
	static propTypes = {
		logout: ProTypes.func.isRequired
	}
	
	render() {
		return (
			<Fragment>
				<Link to="/" className="dropdown-item mb-0" data-toggle="modal" data-target="#logoutModal" onClick={this.props.logout} >
					<i className="fa fa-fw fa-arrow-alt-circle-left text-gray mr-1"></i> Đăng xuất
                </Link>
			</Fragment>
		)
	}
}

export default connect(null, { logout })(Logout);