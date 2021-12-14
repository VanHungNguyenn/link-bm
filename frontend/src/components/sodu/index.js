import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
class SoDu extends Component {
	render() {
		const { user } = this.props.auth;
		
		return (
			<Fragment>
				<div className="content">
                    <div className="block block-rounded block-bordered">
						<div style={{"textAlign":"center"}}>
							<div className="pt-2" >
							   <p>Tên tài khoản : <strong className="text-danger">{user.name}</strong> </p>
							   <p>Số điện thoại : <strong className="text-danger">{user.phone}</strong></p>
							   <p>Số dư :  <strong className="text-danger">{user.balance} VNĐ</strong></p>
							</div>
						</div>
                	</div>
                </div>
			</Fragment>
		)
	}
}

const mapStateToProps = state => ({
	error: state.error,
	auth: state.auth,
	item: state.item
});

export default connect(mapStateToProps, {})(SoDu);