import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import store from '../../store';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { getListDataTaiKhoan, getDataTaiKhoan, editTaiKhoanfunc, xoaTaiKhoan, datlaiMatKhau, historyUser} from '../../actions/taikhoanAction';
import NumberFormat from 'react-number-format';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import Swal from 'sweetalert2';
import BalanceModal from './modal/BalanceModal';
import {
	Modal,
	ModalBody,
	ModalFooter
} from 'reactstrap';

class ListDataVip extends Component {
	static propTypes =  {
		auth: PropTypes.object.isRequired,
		taikhoan: PropTypes.object.isRequired,
		getListDataTaiKhoan: PropTypes.func.isRequired,
		getDataTaiKhoan: PropTypes.func.isRequired,
		editTaiKhoanfunc: PropTypes.func.isRequired,
	}

	state = {
		isModalBrowseGroupsOpen: false,
		isModalResetPassOpen: false,
		isModalViewHistory: false,
		deletearr: [],
		password: '',
		comfimpassword: '',
		id: ''
	}
	
	componentDidMount() {
		this.props.getListDataTaiKhoan();
  	}
	
	handleOnSelect = (isSelect, row) => {
		var { selectedtaikhoan } = this.props.taikhoan;
		var object_delete = [...selectedtaikhoan];
		if (isSelect) {
			object_delete.push({"_id": row._id});
		} else {
			object_delete = object_delete.filter(x => x._id !== row._id);
		}
		// console.log(object_delete);
		store.dispatch({
			type: 'PUSH_SELECTED_TAIKHOAN',
			payload: object_delete
		});
	}
	
	handleOnSelectAll = (isSelect, rows) => {
		var object_delete = [];
		if (isSelect) {
			rows.forEach(function(item, i){
				object_delete.push({"_id": item._id});
			});
		} else {
			object_delete = object_delete.filter(x => x._id !== rows._id);
		}
		// console.log(object_delete);
		store.dispatch({
			type: 'PUSH_SELECTED_TAIKHOAN',
			payload: object_delete
		});
	}
	
	openModalScanGroups = (status, e, row='') => {
		e.preventDefault();
		this.setState({ isModalBrowseGroupsOpen: status });
		if (row !== '') {
			let taikhoan = {
				"_id": row._id,
				"name": row.name,
				"email": row.email,
				"balance": row.balance,
				"tongtiennap":row.tongtiennap,
				"thembot": "",
				"thembot_value": 0,
			}
			this.props.getDataTaiKhoan(taikhoan);
		}
	}
	openModalScanResetPass = (status, e, id) => {
		e.preventDefault();
		this.setState({ isModalResetPassOpen: status, id: id, password:'', comfimpassword: ''});
	}
	openModalLichsugiaodich= (status,e, id) => {
		e.preventDefault();
		this.props.historyUser(id);
		this.setState({ isModalViewHistory: status});
	}
	updateTaiKhoanInModal = (e) => {
		const { edittaikhoan } = this.props.taikhoan;
		let body = {
			"_id": edittaikhoan._id,
			// "balance": edittaikhoan.balance,
			"thembot": edittaikhoan.thembot,
			"thembot_value": edittaikhoan.thembot_value,
			// "tongtiennap": edittaikhoan.tongtiennap
		}
		this.openModalScanGroups(false, e)
		this.props.editTaiKhoanfunc(body);
	}

	handleBtnClick = () => {
	    if (!this.state.deletearr.includes(2)) {
	      this.setState(() => ({
	        deletearr: [...this.state.deletearr, 2]
	      }));
	    } else {
	      this.setState(() => ({
	        deletearr: this.state.deletearr.filter(x => x !== 2)
	      }));
	    }
	  }

	  handleOnSelect = (row, isSelect) => {
	    if (isSelect) {
	      this.setState(() => ({
	        deletearr: [...this.state.deletearr, row._id]
	      }));
	    } else {
	      this.setState(() => ({
	        deletearr: this.state.deletearr.filter(x => x !== row._id)
	      }));
	    }
	  }

	  handleOnSelectAll = (isSelect, rows) => {
	    const ids = rows.map(r => r._id);
	    if (isSelect) {
	      this.setState(() => ({
	        deletearr: ids
	      }));
	    } else {
	      this.setState(() => ({
	        deletearr: []
	      }));
	    }
	  }

	 deleteUser = (id) =>{
	 	Swal.fire({
		  title: 'Bạn có chắc chắn muốn xóa?',
		  text: "",
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Có'
		}).then((result) => {
		  if (result.value) {
		  		this.props.xoaTaiKhoan(id);
		  }
		})
	 }
	resetPassword = (e)=>{
		if (this.state.password === '' || this.state.comfimpassword === '') {
			Swal.fire('Mật khẩu không được trống', '', 'error');
			return false;
		}
		if (this.state.password !== this.state.comfimpassword) {
			Swal.fire('Mật khẩu và mật khẩu xác nhận phải trùng nhau', '', 'error');
			return false;
		}
		const { password, comfimpassword, id } = this.state;
		const newUser = {
			password:password,
			repeatpassword:comfimpassword,
			id:id
		};
		this.props.datlaiMatKhau(newUser);
		this.setState({
			isModalResetPassOpen: false,
			password: '',
			comfimpassword: '',
			id: ''
		});
	}
	changePass = (e)=>{
		this.setState({[e.target.name]:e.target.value});
	}
	viewHistoryUser = (id) =>{
		this.props.historyUser(id);
	}
	convertDate(date_create){
		var date = new Date(date_create);
		var date_cv = date.getDate() + '-' + (date.getMonth()+1) + '-'+date.getFullYear()+ ' '+date.getHours()+':'+date.getMinutes();
		return date_cv;
	}
	formatMoney(amount, decimalCount = 0, decimal = ".", thousands = ",") {
		  try {
		    decimalCount = Math.abs(decimalCount);
		    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

		    const negativeSign = amount < 0 ? "-" : "";

		    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
		    let j = (i.length > 3) ? i.length % 3 : 0;

		    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
		  } catch (e) {
		    console.log(e)
		  }
	}
	render() {
		var that = this;
		// const selectRow = {
			// mode: 'checkbox',
			// headerColumnStyle: {
				// padding: '8px'
			// },
			// selectColumnStyle: {
				// padding: '8px'
			// },
			// onSelect: (row, isSelect, rowIndex, e) => {
				// this.handleOnSelect(isSelect, row);
			// },
			// onSelectAll: (isSelect, rows, e) => {
				// this.handleOnSelectAll(isSelect, rows);
			// },
		// };
		
		function tienduFormater(cell, row) {
			return (
				<NumberFormat value={ cell } displayType={'text'} thousandSeparator={true} suffix={' vnđ'} />
			);
		}
		function congcuFormater(cell, row) {
			return (
				<Link to="/" data-toggle="modal" data-target="#editBalanceModal" className="btn btn-sm btn-primary text-white text-white mr-1" onClick={ (e) => {that.openModalScanGroups(true, e, row)} }>
					<i className="fas fa-pencil-alt"></i>
				</Link>
			);
		}
		
		const columns = [
			{
				dataField: 'stt',
				text: 'ID',
				sort: true,
			},
			{
				dataField: 'name',
				text: 'Tên',
				sort: true
			}, {
				dataField: 'phone',
				text: 'Số điện thoại',
				sort: true
			},
			{
				dataField: 'tongtiennap',
				text: 'Tổng nạp',
				sort: true,
				formatter:(cell, row, rowIndex) => <Fragment>{this.formatMoney(row.tongtiennap)} VNĐ</Fragment>
			},
			{
				dataField: 'tongtienmua',
				text: 'Tổng chi tiêu',
				sort: true,
				formatter:(cell, row, rowIndex) => <Fragment>{this.formatMoney(row.tongtienmua)} VNĐ</Fragment>
			},
			 {
				dataField: 'balance',
				text: 'Số tiền',
				sort: true,
				formatter: tienduFormater
			},
			{
				dataField: '',
				text: 'Reset password',
				sort: true,
				formatter:(cell, row, rowIndex) => <Fragment><span className="btn btn-primary" style={{"cursor":"pointer"}} onClick={ (e) => {that.openModalScanResetPass(true, e, row._id)} }>Đặt lại</span></Fragment>
			}
			, {
				dataField: '',
				text: 'Công cụ',
				formatter:(cell, row, rowIndex) => <Fragment><Link to="/" data-toggle="modal" data-target="#editBalanceModal" className="btn btn-sm btn-primary text-white text-white mr-1" onClick={ (e) => {that.openModalScanGroups(true, e, row)} }>
					<i className="fas fa-pencil-alt"></i>
				</Link>
				<span className="btn btn-sm btn-danger text-white text-white mr-1" onClick={()=>{this.deleteUser(row._id)}}>
					<i className="fas fa-trash"></i>
				</span>
				<span className="btn btn-sm btn-primary text-white text-white mr-1" onClick={(e)=>{this.openModalLichsugiaodich(true, e, row._id)}}>
					<i className="si si-eye"></i>
				</span>
				</Fragment>
			}
		];

		const columns1 = [
			{
				dataField: '',
				text: 'STT',
				sort: true,
				formatter:(cell, row, rowIndex) => <Fragment>{rowIndex+1}</Fragment>
			},
			{
				dataField: 'name_category',
				text: 'Tên',
				sort: true,
			},
			{
				dataField: 'description_category',
				text: 'Miêu tả',
				sort: true,
			},
			{
				dataField: 'soluongmua',
				text: 'Số lượng',
				sort: true,
			},
			{
				dataField: 'price_buy',
				text: 'Giá',
				sort: true,
			},
			{
				dataField: 'ngaymua',
				text: 'Ngày mua',
				sort: true,
				formatter:(cell, row, rowIndex) => <Fragment>{this.convertDate(row.ngaymua)}</Fragment>
			},
		];
		const { SearchBar } = Search;
		return (
			<Fragment>
				<div className="row">
					<div className="col-md-12">
						<div style={{"marginTop":"0px"}}>
                		<ToolkitProvider
                			keyField="_id"
						  	search
						  	data={ this.props.taikhoan.listtaikhoan }
						  	columns={ columns }
						>
						  {
						    props => (
						      <div>
						        <SearchBar { ...props.searchProps } />
						        <BootstrapTable
						          { ...props.baseProps }
						          keyField="_id"
								  data={ this.props.taikhoan.listtaikhoan }
								  columns={ columns }
						           pagination={ paginationFactory() }
						        />
						      </div>
						    )
						  }
						</ToolkitProvider>
                		
                	</div>
						<Modal className="bt-customWidth-dtable" toggle={(e) => {this.openModalScanGroups(!this.state.isModalBrowseGroupsOpen, e)}} isOpen={this.state.isModalBrowseGroupsOpen}>
							<div className="modal-header">
								<p className="mb-0 text-dark">Chỉnh sửa tài khoản</p>
								<button onClick={(e) => {this.openModalScanGroups(false, e)}} type="button" className="close">×</button>
							</div>
							<ModalBody>
								<BalanceModal />
							</ModalBody>
							<ModalFooter>
								<button type="button" onClick={(e) => {this.updateTaiKhoanInModal(e)}} className="btn btn-primary">Áp dụng</button>
							</ModalFooter>
						</Modal>

						<Modal className="bt-customWidth-dtable" toggle={(e) => {this.openModalScanResetPass(!this.state.isModalResetPassOpen, e)}} isOpen={this.state.isModalResetPassOpen}>
							<div className="modal-header">
								<p className="mb-0 text-dark">Thay đổi mật khẩu</p>
								<button onClick={(e) => {this.openModalScanResetPass(false, e)}} type="button" className="close">×</button>
							</div>
							<ModalBody>
								<div className="form-group">
									<label>Mật khẩu</label>
									<input type="password" className="form-control" name="password" value={this.state.password} onChange={this.changePass}/>
								</div>
								<div className="form-group">
									<label>Nhập lại mật khẩu</label>
									<input type="password" className="form-control" name="comfimpassword" value={this.state.comfimpassword} onChange={this.changePass}/>
								</div>
							</ModalBody>
							<ModalFooter>
								<button type="button" onClick={(e) => {this.resetPassword(e)}} className="btn btn-primary">Áp dụng</button>
							</ModalFooter>
						</Modal>

						<Modal className="bt-customWidth-dtable" toggle={(e) => {this.openModalLichsugiaodich(!this.state.isModalViewHistory, e)}} isOpen={this.state.isModalViewHistory}>
							<div className="modal-header">
								<p className="mb-0 text-dark">Thông tin giao dich</p>
								<button onClick={(e) => {this.openModalLichsugiaodich(false, e)}} type="button" className="close">×</button>
							</div>
							<ModalBody>
								<BootstrapTable
						          keyField="_id"
								  data={ this.props.item.lichsumua }
								  columns={ columns1 }
						           pagination={ paginationFactory() }
						        />
							</ModalBody>
						</Modal>
					</div>
				</div>
			</Fragment>
		)
	}

}

const mapStateToProps = state => ({
	item: state.item,
	auth: state.auth,
	taikhoan: state.taikhoan
});
const mapDispatchToProps = { getListDataTaiKhoan, getDataTaiKhoan, editTaiKhoanfunc, xoaTaiKhoan, datlaiMatKhau, historyUser}

export default connect(mapStateToProps, mapDispatchToProps)(ListDataVip);