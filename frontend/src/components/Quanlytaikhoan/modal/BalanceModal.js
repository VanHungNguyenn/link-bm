import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import '../../../css/ancss.css';

import NumberFormat from 'react-number-format';
import { getDataTaiKhoan } from '../../../actions/taikhoanAction';

class BalanceModal extends Component {
	state = {
		thembot: "",
		thembot_value: 0,
	};
	
	static propTypes =  {
		auth: PropTypes.object.isRequired,
		taikhoan: PropTypes.object.isRequired,
		getDataTaiKhoan: PropTypes.func.isRequired,
	};
	
	componentWillMount() {
		
	};
	
	componentDidMount() {
		
	};

	onChange = e => {
		const { edittaikhoan } = this.props.taikhoan;
		let taikhoan = {
			...edittaikhoan,
			[e.target.name]: e.target.value,
		};
		this.props.getDataTaiKhoan(taikhoan);
	};
	

	render() {
		const { edittaikhoan } = this.props.taikhoan;
		var balance_tmp = 0;
		if (edittaikhoan.thembot === "+") {
			balance_tmp = parseInt(edittaikhoan.balance) + parseInt(edittaikhoan.thembot_value);
		} else if (edittaikhoan.thembot === "-") {
			balance_tmp = parseInt(edittaikhoan.balance) - parseInt(edittaikhoan.thembot_value);
		} else {
			balance_tmp = parseInt(edittaikhoan.balance);
		}
		return (
			<Fragment>
				<div className="row">
					<div className="col-md-12">
						<div className="block block-rounded block-bordered">
							<div className="block-header block-header-default">
								<h6 className="block-title">
									{ edittaikhoan.name } - { edittaikhoan.email }
								</h6>
							</div>
							<div className="block-content">
								Số dư hiện tại: <strong><NumberFormat value={ edittaikhoan.balance } displayType={'text'} thousandSeparator={true} suffix={' vnđ'} /></strong>
								<select className="an-calculator" name="thembot" onChange={this.onChange} defaultValue="" >
									<option value=""></option>
									<option value="+">+</option>
									<option value="-">-</option>
								</select>
								<input type="text" className="an-calculator" name="thembot_value" onChange={this.onChange} />
								= <strong><NumberFormat value={ balance_tmp } displayType={'text'} thousandSeparator={true} suffix={' vnđ'} /></strong>
							</div>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
	taikhoan: state.taikhoan
});
const mapDispatchToProps = { getDataTaiKhoan }

export default connect(mapStateToProps, mapDispatchToProps)(BalanceModal);