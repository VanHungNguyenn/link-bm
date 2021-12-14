import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import '../../css/tien.css';
import ListDataTaiKhoan from './ListDataTaiKhoan';
import {
	Modal,
	ModalBody,
} from 'reactstrap';
import { registerUser } from '../../actions/taikhoanAction';

import Swal from 'sweetalert2';
class Quanlynhom extends Component {
	state = {
		isModalBrowseGroupsOpen: false,
		user_name: '',
		user_phone: '',
		user_pass: '',
		user_passcomfim: ''
	}
	
	static propTypes = {
		auth: PropTypes.object.isRequired,
		taikhoan: PropTypes.object.isRequired,
	}
	openModalScanGroups = (status, e) => {
		this.setState({ 
			isModalBrowseGroupsOpen: status,
			user_name: '',
			user_phone: '',
			user_pass: '',
			user_passcomfim: ''
		});
	}
	onChange = (e) =>{
		this.setState({ [e.target.name]: e.target.value });
	}
	telephoneCheck(str) {
	  var isphone = /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(str);
	  return isphone;
	}
	saveAccount(){
		if (this.state.user_name === '') {
			Swal.fire('Tên không được trống', '', 'error');
			return false;
		}
		if (this.state.user_phone === '') {
			Swal.fire('Số điện thoại không được trống', '', 'error');
			return false;
		}
		if (this.state.user_pass === '') {
			Swal.fire('Mật khẩu không được trống', '', 'error');
			return false;
		}
		if (this.state.user_passcomfim === '') {
			Swal.fire('Mật khẩu xác nhận không được trống', '', 'error');
			return false;
		}
		if (this.state.user_pass !== this.state.user_passcomfim) {
			Swal.fire('Mật khẩu và mật khẩu xác nhận phải trùng nhau', '', 'error');
			return false;
		}
		// if (!this.telephoneCheck(this.state.user_phone)) {
		// 	Swal.fire('Số điện thoại không đúng định dạng', '', 'error');
		// 	return false;
		// }
		const { user_name, user_phone, user_pass, user_passcomfim } = this.state;
		
		// Create user object
		const newUser = {
			name:user_name,
			phone:user_phone,
			password:user_pass,
			repeatpassword:user_passcomfim
		};
		
		// Attempt to register
		this.props.registerUser(newUser);
	}
	render() {
		return (
			<div className="content">
                    <div className="block block-rounded block-bordered">
			<div className="block block-rounded block-bordered">
				<div className="block-header block-header-default">
					<h6 className="block-title">Quản lý tài khoản</h6>
				</div>
				<div className="block-content">
					<div>
                		<button className="btn btn-primary" onClick={(e)=>{this.openModalScanGroups(true, e)}}>Thêm mới</button>
                	</div>
					<ListDataTaiKhoan/>
				</div>
			</div>
			</div>
				<Modal className="bt-customWidth-dtable" toggle={(e) => {this.openModalScanGroups(!this.state.isModalBrowseGroupsOpen, e)}} isOpen={this.state.isModalBrowseGroupsOpen}>
					<div className="modal-header">
						<p className="mb-0 text-dark">Thêm tài khoản</p>
						<button onClick={(e) => {this.openModalScanGroups(false, e)}} type="button" className="close">×</button>
					</div>
					<ModalBody>
						<div className="row">
					    	<div className="col-md-12">
						        <div className="form-group">
                                    <label for="id_category">Tên tài khoản</label>
                                    <input className="form-control" type="text" name="user_name" value={this.state.user_name} onChange={this.onChange} placeholder="tên tài khoản ..."/>
                                </div>
                                <div className="form-group">
                                   <label for="description_category">Số điện thoại</label>
                                   <input className="form-control" type="text" name="user_phone" value={this.state.user_phone} onChange={this.onChange} placeholder="số điện thoại ..."/>
                                </div>
                                <div className="form-group">
                                   <label for="description_category">Mật khẩu</label>
                                   <input className="form-control" type="text" name="user_pass" value={this.state.user_pass} onChange={this.onChange} placeholder="mật khẩu ..."/>
                                </div>
                                <div className="form-group">
                                   <label for="description_category">Nhập lại mật khẩu</label>
                                   <input className="form-control" type="text" name="user_passcomfim" value={this.state.user_passcomfim} onChange={this.onChange} placeholder="mật khẩu ..."/>
                                </div>
					        </div>
					    </div>
					</ModalBody>
					<div className="modal-footer">
						<button className="btn btn-primary" onClick={()=>{this.saveAccount()}}>Lưu</button>
					</div>
				</Modal>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
	taikhoan: state.taikhoan
})

export default connect(mapStateToProps, {registerUser})(Quanlynhom);