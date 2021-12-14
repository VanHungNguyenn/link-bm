import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { muaGoi } from '../../actions/banggiaAction';
import { confirmAlert } from 'react-confirm-alert';
import NumberFormat from 'react-number-format';

class BanggiaGroups extends Component {
	state = {
		
	};
	
	static propTypes = {
		auth: PropTypes.object.isRequired,
		muaGoi: PropTypes.func.isRequired,
	}
	
	clickMuaGoi = (type, v, money, limit_nhom, limit_vip) => {
		const { _id, balance } = this.props.auth.user;
		// console.log(this.props.auth);
		var body = {
			"_id": _id,
			"type": type,
			"balance": balance,
			"ten_goi": v,
			"money": money,
			"limit_nhom": limit_nhom,
			"limit_vip": limit_vip,
		}
		this.props.muaGoi(body);
		// console.log(v);
	}
	
	onClickGoi = (type, v, money, limit_nhom, limit_vip) => {
		confirmAlert({
			// closeOnClickOutside: false,
			customUI: ({ onClose }) => {
				return	(
					<div aria-labelledby="swal2-title" aria-describedby="swal2-content" className="swal2-popup swal2-modal swal2-icon-warning swal2-show an-confirm-alert" tabIndex="-1" role="dialog" aria-live="assertive" aria-modal="true" style={{"display": "flex"}}>
						<div className="swal2-header">
							<div className="swal2-icon swal2-warning swal2-icon-show" style={{"display": "flex"}}>
								<div className="swal2-icon-content">?</div>
							</div>
							<h2 className="swal2-title" id="swal2-title" style={{"display": "flex"}}>
								<NumberFormat value={ money } displayType={'text'} thousandSeparator={true} prefix={v +' - '} suffix={' đ / tháng'} />
							</h2>
						</div>
						<div className="swal2-content">
							<div id="swal2-content" className="swal2-html-container" style={{"display": "block"}}>Bạn có chắc chắn mua gói này không?</div>
							<div className="swal2-validation-message" id="swal2-validation-message"></div>
						</div>
						<div className="swal2-actions">
							<button type="button" className="swal2-confirm btn btn-danger m-1" aria-label="" style={{"display": "inline-block"}} onClick={() => { this.clickMuaGoi(type, v, money, limit_nhom, limit_vip); onClose(); }} >Đồng ý</button>
							<button type="button" className="swal2-cancel btn btn-secondary m-1" aria-label="" style={{"display": "inline-block"}} onClick={() => { onClose(); }} >Hủy</button>
						</div>
					</div>
				)
			}
		});
	}

	render() {
		return (
			<Fragment>
				<div className="row an-custom-padding-banggia">
					<div className="col-md-6 col-xl-3">
						<Link className="block block-rounded text-center" to="/banggia/groups" onClick={ (e) => {this.onClickGoi('groups', 'Gói 1', '150000', '1', '100')} }>
							<div className="block-header">
								<h3 className="block-title">Gói 1</h3>
							</div>
							<div className="block-content bg-primary">
								<div className="py-2">
									<p className="h1 font-w700 text-white mb-2">150,000 đ</p>
									<p className="h6 text-white-75">/ tháng</p>
								</div>
							</div>
							<div className="block-content">
								<div className="py-2">
									<p>
										<strong>1</strong> nhóm
									</p>
									<p>
										<strong><i className="fas fa-infinity"></i></strong> tài khoản vip
									</p>
									<p>
										<strong>Hỗ trợ 24/7</strong>
									</p>
								</div>
							</div>
							<div className="block-content block-content-full bg-body-light">
								<span className="btn btn-rounded btn-hero-primary px-4">Chốt !</span>
							</div>
						</Link>
					</div>
					<div className="col-md-6 col-xl-3">
						<Link className="block block-link-rotate block-rounded text-center" to="/banggia/groups" onClick={ (e) => {this.onClickGoi('groups', 'Gói 2', '700000', '5', '200')} } >
							<div className="block-header">
								<h3 className="block-title">Gói 2</h3>
							</div>
							<div className="block-content bg-success">
								<div className="py-2">
									<p className="h1 font-w700 text-white mb-2">700,000 đ</p>
									<p className="h6 text-white-75">/ tháng</p>
								</div>
							</div>
							<div className="block-content">
								<div className="py-2">
									<p>
										<strong>5</strong> nhóm
									</p>
									<p>
										<strong><i className="fas fa-infinity"></i></strong> tài khoản vip
									</p>
									<p>
										<strong>Hỗ trợ 24/7</strong>
									</p>
								</div>
							</div>
							<div className="block-content block-content-full bg-body-light">
								<span className="btn btn-rounded btn-hero-success px-4">Chốt !</span>
							</div>
						</Link>
					</div>
					<div className="col-md-6 col-xl-3">
						<Link className="block block-link-shadow block-rounded text-center" to="/banggia/groups" onClick={ (e) => {this.onClickGoi('groups', 'Gói 3', '1400000', '10', '500')} } >
							<div className="block-header">
								<h3 className="block-title">Gói 3</h3>
							</div>
							<div className="block-content bg-warning">
								<div className="py-2">
									<p className="h1 font-w700 text-white mb-2">1,400,000 đ</p>
									<p className="h6 text-white-75">/ tháng</p>
								</div>
							</div>
							<div className="block-content">
								<div className="py-2">
									<p>
										<strong>10</strong> nhóm
									</p>
									<p>
										<strong><i className="fas fa-infinity"></i></strong> tài khoản vip
									</p>
									<p>
										<strong>Hỗ trợ 24/7</strong>
									</p>
								</div>
							</div>
							<div className="block-content block-content-full bg-body-light">
								<span className="btn btn-rounded btn-hero-warning px-4">Chốt !</span>
							</div>
						</Link>
					</div>
					<div className="col-md-6 col-xl-3">
						<Link className="block block-link-pop block-rounded text-center" to="/banggia/groups" onClick={ (e) => {this.onClickGoi('groups', 'Gói 4', '2700000', '20', '1000')} } >
							<div className="block-header">
								<h3 className="block-title">Gói 4</h3>
							</div>
							<div className="block-content bg-danger">
								<div className="py-2">
									<p className="h1 font-w700 text-white mb-2">2,700,000 đ</p>
									<p className="h6 text-white-75">/ tháng</p>
								</div>
							</div>
							<div className="block-content">
								<div className="py-2">
									<p>
										<strong>20</strong> nhóm
									</p>
									<p>
										<strong><i className="fas fa-infinity"></i></strong> tài khoản vip
									</p>
									<p>
										<strong>Hỗ trợ 24/7</strong>
									</p>
								</div>
							</div>
							<div className="block-content block-content-full bg-body-light">
								<span className="btn btn-rounded btn-hero-danger px-4">Chốt !</span>
							</div>
						</Link>
					</div>
				</div>
				<div className="row an-custom-padding-banggia">
					<div className="col-md-6 col-xl-3">
						<Link className="block block-rounded text-center" to="/banggia/groups" onClick={ (e) => {this.onClickGoi('groups', 'Gói 5', '6500000', '50', '100')} }>
							<div className="block-header">
								<h3 className="block-title">Gói 5</h3>
							</div>
							<div className="block-content bg-primary">
								<div className="py-2">
									<p className="h1 font-w700 text-white mb-2">6,500,000 đ</p>
									<p className="h6 text-white-75">/ tháng</p>
								</div>
							</div>
							<div className="block-content">
								<div className="py-2">
									<p>
										<strong>50</strong> nhóm
									</p>
									<p>
										<strong><i className="fas fa-infinity"></i></strong> tài khoản vip
									</p>
									<p>
										<strong>Hỗ trợ 24/7</strong>
									</p>
								</div>
							</div>
							<div className="block-content block-content-full bg-body-light">
								<span className="btn btn-rounded btn-hero-primary px-4">Chốt !</span>
							</div>
						</Link>
					</div>
					<div className="col-md-6 col-xl-3">
						<Link className="block block-link-rotate block-rounded text-center" to="/banggia/groups" onClick={ (e) => {this.onClickGoi('groups', 'Gói 6', '12500000', '100', '200')} } >
							<div className="block-header">
								<h3 className="block-title">Gói 6</h3>
							</div>
							<div className="block-content bg-success">
								<div className="py-2">
									<p className="h1 font-w700 text-white mb-2">12,500,000 đ</p>
									<p className="h6 text-white-75">/ tháng</p>
								</div>
							</div>
							<div className="block-content">
								<div className="py-2">
									<p>
										<strong>100</strong> nhóm
									</p>
									<p>
										<strong><i className="fas fa-infinity"></i></strong> tài khoản vip
									</p>
									<p>
										<strong>Hỗ trợ 24/7</strong>
									</p>
								</div>
							</div>
							<div className="block-content block-content-full bg-body-light">
								<span className="btn btn-rounded btn-hero-success px-4">Chốt !</span>
							</div>
						</Link>
					</div>
					<div className="col-md-6 col-xl-3">
						<Link className="block block-link-shadow block-rounded text-center" to="/banggia/groups" onClick={ (e) => {this.onClickGoi('groups', 'Gói 7', '18000000', '150', '500')} } >
							<div className="block-header">
								<h3 className="block-title">Gói 7</h3>
							</div>
							<div className="block-content bg-warning">
								<div className="py-2">
									<p className="h1 font-w700 text-white mb-2">18,000,000 đ</p>
									<p className="h6 text-white-75">/ tháng</p>
								</div>
							</div>
							<div className="block-content">
								<div className="py-2">
									<p>
										<strong>150</strong> nhóm
									</p>
									<p>
										<strong><i className="fas fa-infinity"></i></strong> tài khoản vip
									</p>
									<p>
										<strong>Hỗ trợ 24/7</strong>
									</p>
								</div>
							</div>
							<div className="block-content block-content-full bg-body-light">
								<span className="btn btn-rounded btn-hero-warning px-4">Chốt !</span>
							</div>
						</Link>
					</div>
					<div className="col-md-6 col-xl-3">
						<Link className="block block-link-pop block-rounded text-center" to="/banggia/groups" onClick={ (e) => {this.onClickGoi('groups', 'Gói 8', '20000000', '200', '1000')} } >
							<div className="block-header">
								<h3 className="block-title">Gói 8</h3>
							</div>
							<div className="block-content bg-danger">
								<div className="py-2">
									<p className="h1 font-w700 text-white mb-2">20,000,000 đ</p>
									<p className="h6 text-white-75">/ tháng</p>
								</div>
							</div>
							<div className="block-content">
								<div className="py-2">
									<p>
										<strong>200</strong> nhóm
									</p>
									<p>
										<strong><i className="fas fa-infinity"></i></strong> tài khoản vip
									</p>
									<p>
										<strong>Hỗ trợ 24/7</strong>
									</p>
								</div>
							</div>
							<div className="block-content block-content-full bg-body-light">
								<span className="btn btn-rounded btn-hero-danger px-4">Chốt !</span>
							</div>
						</Link>
					</div>
				</div>
			</Fragment>
		)
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
});
const mapDispatchToProps = { muaGoi };

export default connect(mapStateToProps, mapDispatchToProps)(BanggiaGroups);