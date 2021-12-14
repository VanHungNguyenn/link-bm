import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import { saveProduct, editStatusProduct, deleteProductMulti, getProductByCategory} from '../../actions/itemActions';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import {
	Modal,
	ModalBody,
} from 'reactstrap';
const myNewTheme= {
    headCells: {
      style: {
        fontWeight: 'bold',
          fontSize: '14px',
      },
  }
}
class SanPham extends Component {
	state = {
		isModalBrowseGroupsOpen: false,
		isModalBrowseGroupsStatusOpen: false,
		id_fb: '',
		id_category: 0,
		data_product: '',
		id_product: '',
		deletearr: [],
		hidecheckbox: true,
		selected: '',
		listtype: '',
		status_product: '',
	}
	componentDidMount(){
		this.props.getProductByCategory();
	}
	handleChange = (state) => {
		// You can use setState or dispatch with something like Redux so we can use the retrieved data
		var object_delete = [];
		state.selectedRows.forEach(function(item, i){
			object_delete.push(item._id);
		});
		this.setState({ deletearr: object_delete });
	}
	openModalScanGroups = (status, e) => {
		this.setState({ 
			isModalBrowseGroupsOpen: status,
			id_fb: '',
			id_category: 0,
			data_product: '',
			id_product: '',
			deletearr: []
		});
	}
	openModalScanGroupsStatus = (status, e) => {
		this.setState({ 
			isModalBrowseGroupsStatusOpen: status,
			id_product: '',
			status_product: '',
		});
	}
	onChange = (e) =>{
		this.setState({ [e.target.name]: e.target.value });
	}
	
	saveCategory = (listtype) =>{
		if (this.state.id_category === 0) {
			Swal.fire('Bạn phải chọn loại sản phẩm', '', 'error');
			return false;
		}
		if (this.state.data_product === '') {
			Swal.fire('dữ liệu sản phẩm không được trống', '', 'error');
			return false;
		}
		var data = {
			id_fb:this.state.id_fb,
			id_loaisp: this.state.id_category,
			data:this.state.data_product,
			id_product: this.state.id_product
		}
		this.setState({ isModalBrowseGroupsOpen: false });
		this.props.saveProduct(data, listtype);
	}
	
	editStatusCategory = (listtype) =>{
		var data = {
			id_product: this.state.id_product,
			status_product: this.state.status_product
		}
		this.setState({ isModalBrowseGroupsStatusOpen: false });
		this.props.editStatusProduct(data, listtype);
	}
	
	editCategoryProduct(id, index){
		const { productAmin } = this.props.item;
		var that = this;
		if (productAmin.length > 0) {
		productAmin.forEach(function(value,index){
			if (id === value._id) {
				that.setState({ 
					isModalBrowseGroupsOpen: true,
					id_fb: value.id_fb,
					id_category: value.id_loaisp,
					data_product: value.data,
					id_product: value._id
				});
			}
		});
		}
	}

	openStatusProduct(id, index){
		const { productAmin } = this.props.item;
		var that = this;
		if (productAmin.length > 0) {
		productAmin.forEach(function(value,index){
			if (id === value._id) {
				that.setState({ 
					isModalBrowseGroupsStatusOpen: true,
					id_product: value._id,
					status_product: value.status,
				});
			}
		});
		}
	}
	
	deleteProduct(){
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
		  		this.props.deleteProductMulti(this.state.deletearr);
		  }
		})
	}
	convertDate(date_create){
		var date = new Date(date_create);
		var date_cv = date.getDate() + '-' + (date.getMonth()+1) + '-'+date.getFullYear()+ ' '+date.getHours()+':'+date.getMinutes();
		return date_cv;
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
	clickGetProductByCategory(listtype = ''){
		if (listtype == 'chuaban') {
			this.setState(() => ({
				hidecheckbox: false,
				listtype: 'chuaban'
			}));
			this.props.getProductByCategory('chuaban');
		} else if (listtype == 'daban') {
			this.setState(() => ({
				hidecheckbox: true,
				listtype: 'daban'
			}));
			this.props.getProductByCategory('daban');
		} else {
			this.setState(() => ({
				hidecheckbox: true,
				listtype: ''
			}));
			this.props.getProductByCategory();
		}
	}
	render() {
		var selectRow = {};
		if (this.state.hidecheckbox) {
			selectRow = {
				mode: 'checkbox',
				// clickToSelect: true,
				selected: this.state.selected,
				onSelect: this.handleOnSelect,
				onSelectAll: this.handleOnSelectAll,
				hideSelectColumn: true,
				hideSelectAll: true
			};
		} else {
			selectRow = {
			  mode: 'checkbox',
			  // clickToSelect: true,
			  selected: this.state.selected,
			  onSelect: this.handleOnSelect,
			  onSelectAll: this.handleOnSelectAll,
			  hideSelectColumn: false,
			  hideSelectAll: false
			};
		}
		const { productAmin, items } = this.props.item;
		const category = (<Fragment>
			{
				items.map(function(value,index){
					return (
						<option value={value._id} key={index}>{value.name}</option>
					)
				})
			}
			</Fragment>
		)
		function formatLoaiSanPham(cell, row) {
			var nameloai = '';
			items.forEach(function(value,index){
				if (value._id == cell) {
					nameloai = value.name;
				}
			});
			return nameloai;
		}
		function selectOptions(cell) {
			var nameloai = {};
			items.forEach(function(value,index){
				nameloai[value._id] = value.name;
			});
			return nameloai;
		}
		function formatTrangThai(cell, row) {
			if (row.sell === 1) {
				return ('Đã bán');
			} else {
				return ('Chưa bán');
			}
		}
		function formatTrangThaiAcc(cell, row) {
			var message = '';
			if (cell === 1) {
				return (
					<span className="badge badge-success"><i className="fas fa-check mr-1"></i>Acc OK</span>
				);
			} else if (cell === 2) {
				return (
					<span className="badge badge-danger"><i className="fas fa-times mr-1"></i>Acc Die</span>
				);
			} else {
				return ('');
			}
		}
		function filterValueTrangThaiAcc(cell, row) {
			if (cell === 0) {
				return ('Acc OK');
			} else if (cell === 1) {
				return ('Acc Die');
			} else {
				return ('');
			}
		}
	   const columns = [
			{
			  dataField: '',
			  text: 'STT',
			  sort: true,
			  formatter: (cell, row, rowIndex) =>
			    <span>{rowIndex+1}</span>
			},
			{
				text: 'Dữ liệu',
				dataField: 'data',
				sort: true,
				formatter:(cell, row, rowIndex) => <Fragment>{row.data.slice(0, 30)}</Fragment>
			},
			{
				text: 'Loại sản phẩm',
				dataField: 'id_loaisp',
				sort: true,
				formatter: formatLoaiSanPham,
				filter: selectFilter({
					options: selectOptions
				})
			},
			{
				text: 'Trạng thái',
				dataField: 'sell',
				sort: true,
				headerStyle: (colum, colIndex) => {
				  return { width: '100px' };
				},
				formatter: formatTrangThai,
				filterValue: formatTrangThai
			},
			{
				text: 'Người mua',
				dataField: 'name_user',
				sort: true,
			},
			{
				text: 'Ngày bán',
				dataField: 'date_sell',
				sort: true,
				formatter:(cell, row, rowIndex) => <Fragment>{row.date_sell===null ? ('') : this.convertDate(row.date_sell)}</Fragment>
			},
			{
				text: 'Ngày tạo',
				dataField: 'date',
				sort: true,
				formatter:(cell, row, rowIndex) => <Fragment>{this.convertDate(row.date)}</Fragment>
			},
			{
				text: 'Trạng thái Acc',
				dataField: 'status',
				sort: true,
				formatter: formatTrangThaiAcc,
				filterValue: filterValueTrangThaiAcc
			},
			{
				text: 'Hành động',
				headerStyle: (colum, colIndex) => {
				  return { width: '180px' };
				},
				formatter:(cell, row, rowIndex) => <Fragment>
						<button className="btn btn-sm btn-primary " style={{"marginRight": "5px"}} data={row.index} onClick={()=>{this.openStatusProduct(row._id, row.index)}}>
							<i className="fa fa-pen"></i> Sửa
						</button>
						<button className="btn btn-sm btn-success " data={row.index} onClick={()=>{this.editCategoryProduct(row._id, row.index)}}>
							<i className="fa fa-edit"></i> Cài đặt
						</button>
					</Fragment>

			},
	    ];
	    const { SearchBar } = Search;
		return (
			<Fragment>
				<div className="content">
                    <div className={"block block-bordered shadow"+ (this.props.item.loading? ' block-mode-loading' : '')}>
						<div className="block-header block-header-default border-bottom">
							<h3 className="block-title">Quản lý sản phẩm</h3>
						</div>
						<div className="block-content">
							<div style={{"marginTop":"15px"}}>
								<ToolkitProvider
									keyField="_id"
									search
									data={ productAmin }
									columns={ columns }
								>
								  {
									props => (
									  <div>
										<SearchBar { ...props.searchProps } />
										<div className="row mb-4">
											<div className="col-md-12">
												<button className="btn btn-secondary" onClick={(e)=>{this.openModalScanGroups(true, e)}}>Thêm mới</button>
												<button className="btn btn-danger" style={{"display" : this.state.hidecheckbox ? "none" : "inline-block" ,"marginLeft":"5px"}} onClick={()=>{this.deleteProduct()}}>Xóa</button>
												<button className="btn btn-info" style={{"marginLeft":"5px"}} onClick={()=>{this.clickGetProductByCategory()}}>Tất cả tài khoản</button>
												<button className="btn btn-warning" style={{"marginLeft":"5px"}} onClick={()=>{this.clickGetProductByCategory('chuaban')}}>Tài khoản chưa bán</button>
												<button className="btn btn-success" style={{"marginLeft":"5px"}} onClick={()=>{this.clickGetProductByCategory('daban')}}>Tài khoản đã bán</button>
											</div>
										</div>
										<BootstrapTable
										  { ...props.baseProps }
										  selectRow={ selectRow }
										   pagination={ paginationFactory() }
										   filter={ filterFactory() }
										/>
									  </div>
									)
								  }
								</ToolkitProvider>
								
							</div>
							<Modal className="bt-customWidth-dtable" toggle={(e) => {this.openModalScanGroups(!this.state.isModalBrowseGroupsOpen, e)}} isOpen={this.state.isModalBrowseGroupsOpen}>
								<div className="modal-header">
									<p className="mb-0 text-dark">Thêm sản phẩm</p>
									<button onClick={(e) => {this.openModalScanGroups(false, e)}} type="button" className="close">×</button>
								</div>
								<ModalBody>
									<div className="row">
										<div className="col-md-12">
											<div className="form-group">
												<label htmlFor="id_category">Loại sản phẩm</label>
												<select className="form-control" id="id_category" name="id_category" value={this.state.id_category} onChange={this.onChange}>
													<option value="0">--Chọn loại sản phẩm--</option>
													{category}
												</select>
											</div>
											<div className="form-group">
												<label htmlFor="description_category">Dữ liệu</label>
												<textarea className="form-control" id="data_product" name="data_product" rows="4" placeholder="dữ liệu ..." onChange={this.onChange}>{this.state.data_product}</textarea>
											</div>
										</div>
									</div>
								</ModalBody>
								<div className="modal-footer">
									<button className="btn btn-primary" onClick={(e)=>{this.saveCategory(this.state.listtype)}}>Lưu</button>
								</div>
							</Modal>
							
							<Modal className="bt-customWidth-dtable" toggle={(e) => {this.openModalScanGroupsStatus(!this.state.isModalBrowseGroupsStatusOpen, e)}} isOpen={this.state.isModalBrowseGroupsStatusOpen}>
								<div className="modal-header">
									<p className="mb-0 text-dark">Sửa trạng thái</p>
									<button onClick={(e) => {this.openModalScanGroupsStatus(false, e)}} type="button" className="close">×</button>
								</div>
								<ModalBody>
									<div className="row">
										<div className="col-md-12">
											<div className="form-group">
												<label htmlFor="status_product">Loại trạng thái</label>
												<select className="form-control" id="status_product" name="status_product" value={this.state.status_product} onChange={this.onChange}>
													<option value="1">Acc OK</option>
													<option value="2">Acc Die</option>
												</select>
											</div>
										</div>
									</div>
								</ModalBody>
								<div className="modal-footer">
									<button className="btn btn-primary" onClick={(e)=>{this.editStatusCategory(this.state.listtype)}}>Lưu</button>
								</div>
							</Modal>
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

export default connect(mapStateToProps, {saveProduct, editStatusProduct, deleteProductMulti, getProductByCategory})(SanPham);