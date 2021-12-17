import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import DataTable from 'react-data-table-component'
import BootstrapTable from 'react-bootstrap-table-next'
import Swal from 'sweetalert2'
import {
	saveCategoryProduct,
	deleteCategoryProduct,
} from '../../actions/itemActions'
import paginationFactory from 'react-bootstrap-table2-paginator'
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit'
import { Modal, ModalBody } from 'reactstrap'
import countryList from '../../config/country'
import iconList from '../../config/icon'

const myNewTheme = {
	headCells: {
		style: {
			fontWeight: 'bold',
			fontSize: '14px',
		},
	},
}
class LoaiSanPham extends Component {
	state = {
		isModalBrowseGroupsOpen: false,
		name_category: '',
		price_category: 0,
		type_category: 'BM',
		country_category: 'vn',
		icon_category: 'vn',
		description_category: '',
		id_category: '',
		deletearr: [],
	}

	handleChange = (state) => {
		// You can use setState or dispatch with something like Redux so we can use the retrieved data
		var object_delete = []
		state.selectedRows.forEach(function (item, i) {
			object_delete.push(item._id)
		})
		this.setState({ deletearr: object_delete })
	}
	openModalScanGroups = (status, e) => {
		this.setState({
			isModalBrowseGroupsOpen: status,
			name_category: '',
			price_category: 0,
			type_category: 'BM',
			country_category: 'vn',
			icon_category: 'vn',
			description_category: '',
			id_category: '',
			deletearr: [],
		})
	}
	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value })
	}
	saveCategory = (e) => {
		if (this.state.name_category === '') {
			Swal.fire('Tên không được trống', '', 'error')
			return false
		}
		if (this.state.price_category < 0) {
			Swal.fire('giá phải lớn hơn 0', '', 'error')
			return false
		}
		var data = {
			name: this.state.name_category,
			description: this.state.description_category,
			price: parseInt(this.state.price_category),
			type: this.state.type_category,
			country: this.state.country_category,
			icon: this.state.icon_category,
			id_category: this.state.id_category,
		}
		this.setState({ isModalBrowseGroupsOpen: false })
		this.props.saveCategoryProduct(data)
	}

	editCategoryProduct(id, index) {
		const { items } = this.props.item
		var that = this
		items.forEach(function (value, index) {
			if (id === value._id) {
				that.setState({
					isModalBrowseGroupsOpen: true,
					name_category: value.name,
					description_category: value.description,
					price_category: value.price,
					type_category: value.type,
					country_category: value.country,
					icon_category: value.icon,
					id_category: id,
				})
			}
		})
	}
	deleteCategory() {
		Swal.fire({
			title: 'Bạn có chắc chắn muốn xóa?',
			text: '',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Có',
		}).then((result) => {
			if (result.value) {
				this.props.deleteCategoryProduct(this.state.deletearr)
			}
		})
	}
	convertDate(date_create) {
		var date = new Date(date_create)
		var date_cv =
			date.getDate() +
			'-' +
			(date.getMonth() + 1) +
			'-' +
			date.getFullYear() +
			' ' +
			date.getHours() +
			':' +
			date.getMinutes()
		return date_cv
	}
	handleBtnClick = () => {
		if (!this.state.deletearr.includes(2)) {
			this.setState(() => ({
				deletearr: [...this.state.deletearr, 2],
			}))
		} else {
			this.setState(() => ({
				deletearr: this.state.deletearr.filter((x) => x !== 2),
			}))
		}
	}

	handleOnSelect = (row, isSelect) => {
		if (isSelect) {
			this.setState(() => ({
				deletearr: [...this.state.deletearr, row._id],
			}))
		} else {
			this.setState(() => ({
				deletearr: this.state.deletearr.filter((x) => x !== row._id),
			}))
		}
	}

	handleOnSelectAll = (isSelect, rows) => {
		const ids = rows.map((r) => r._id)
		if (isSelect) {
			this.setState(() => ({
				deletearr: ids,
			}))
		} else {
			this.setState(() => ({
				deletearr: [],
			}))
		}
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
		const selectRow = {
			mode: 'checkbox',
			clickToSelect: true,
			selected: this.state.selected,
			onSelect: this.handleOnSelect,
			onSelectAll: this.handleOnSelectAll,
		}
		const { items } = this.props.item
		const columns = [
			{
				dataField: '',
				text: 'STT',
				sort: true,
				formatter: (cell, row, rowIndex) => <span>{rowIndex + 1}</span>,
			},
			{
				text: 'Tên',
				dataField: 'name',
				formatter: (cell, row, rowIndex) => (
					<>
						{row.icon} {row.name}
					</>
				),
			},
			{
				text: 'Thể loại',
				dataField: 'type',
			},
			{
				text: 'Quốc gia',
				dataField: 'country',
			},
			{
				text: 'Icon',
				dataField: 'icon',
				formatter: (cell, row, rowIndex) => {
					let index = 0
					for (let i = 0; i < iconList.length; i++) {
						if (iconList.code === row.icon) {
							index = i
							break
						}
					}
					return (
						<>
							{row.icon ? (
								<img
									style={{ width: 30 }}
									src={iconList[index].image}
									alt='logo'
								/>
							) : null}
						</>
					)
				},
			},
			// {
			// 	text: 'Miêu tả',
			// 	dataField: 'description',
			// 	formatter: (cell, row, rowIndex) => (
			// 		<Fragment>{row.description.slice(0, 30)}</Fragment>
			// 	),
			// },
			{
				text: 'Giá',
				dataField: 'price',
				formatter: (cell, row, rowIndex) => (
					<Fragment>{this.formatMoney(row.price)} VNĐ</Fragment>
				),
			},
			{
				text: 'Ngày tạo',
				dataField: 'date',
				formatter: (cell, row, rowIndex) => (
					<Fragment>{this.convertDate(row.date)}</Fragment>
				),
			},
			{
				text: 'Hành động',
				formatter: (cell, row, rowIndex) => (
					<Fragment>
						<button
							className='btn btn-sm btn-primary '
							data={row.index}
							onClick={() => {
								this.editCategoryProduct(row._id, row.index)
							}}
						>
							<i className='fa fa-edit'></i> Sửa
						</button>
					</Fragment>
				),
			},
		]
		return (
			<Fragment>
				<div className='content'>
					<div className='block block-rounded block-bordered'>
						<div className='block-header block-header-default border-bottom'>
							<h3 className='block-title'>
								Quản lý loại sản phẩm
							</h3>
						</div>
						<div className='block-content'>
							<div>
								<button
									className='btn btn-primary'
									onClick={(e) => {
										this.openModalScanGroups(true, e)
									}}
								>
									Thêm mới
								</button>
								<button
									className='btn btn-danger'
									style={{ 'margin-left': '5px' }}
									onClick={() => {
										this.deleteCategory()
									}}
								>
									Xóa
								</button>
							</div>
							<div style={{ marginTop: '15px' }}>
								<BootstrapTable
									keyField='_id'
									data={items}
									columns={columns}
									selectRow={selectRow}
									striped
									hover
									wrapperClasses='table-responsive'
									pagination={paginationFactory()}
									search={{ searchFormatted: true }}
								/>
							</div>
							<Modal
								className='bt-customWidth-dtable'
								toggle={(e) => {
									this.openModalScanGroups(
										!this.state.isModalBrowseGroupsOpen,
										e
									)
								}}
								isOpen={this.state.isModalBrowseGroupsOpen}
							>
								<div className='modal-header'>
									<p className='mb-0 text-dark'>
										Thêm loại sản phẩm
									</p>
									<button
										onClick={(e) => {
											this.openModalScanGroups(false, e)
										}}
										type='button'
										className='close'
									>
										×
									</button>
								</div>
								<ModalBody>
									<div className='row'>
										<div className='col-md-12'>
											<div className='form-group'>
												<label for='name_category'>
													Tên loại sản phẩm
												</label>
												<input
													type='text'
													className='form-control'
													id='name_category'
													name='name_category'
													placeholder='tên ...'
													value={
														this.state.name_category
													}
													onChange={this.onChange}
												/>
											</div>
											<div className='form-group'>
												<label for='price_category'>
													Giá loại sản phẩm
												</label>
												<input
													type='number'
													className='form-control'
													id='price_category'
													name='price_category'
													value={
														this.state
															.price_category
													}
													onChange={this.onChange}
												/>
											</div>
											<div className='form-group'>
												<label for='type_category'>
													Thể loại
												</label>
												<select
													className='form-control'
													id='type_category'
													name='type_category'
													value={
														this.state.type_category
													}
													onChange={this.onChange}
												>
													<option value='BM'>
														BM
													</option>
													<option value='VIA'>
														VIA
													</option>
												</select>
											</div>
											<div className='form-group'>
												<label for='country_category'>
													Quốc gia
												</label>
												<select
													className='form-control'
													id='country_category'
													name='country_category'
													value={
														this.state
															.country_category
													}
													onChange={this.onChange}
												>
													{countryList.map(
														(item, i) => {
															console.log(
																item.name
															)
															return (
																<option
																	key={i}
																	value={
																		item.code
																	}
																>
																	{item.name}
																</option>
															)
														}
													)}
												</select>
											</div>
											<div className='form-group'>
												<label for='icon_category'>
													Icon
												</label>
												<select
													className='form-control'
													id='icon_category'
													name='icon_category'
													value={
														this.state.icon_category
													}
													onChange={this.onChange}
												>
													{iconList.map((item, i) => {
														return (
															<option
																key={i}
																value={
																	item.code
																}
															>
																{item.name}
															</option>
														)
													})}
												</select>
											</div>
											<div className='form-group'>
												<label for='description_category'>
													Miêu tả
												</label>
												<textarea
													className='form-control'
													id='description_category'
													name='description_category'
													rows='4'
													placeholder='miêu tả ...'
													onChange={this.onChange}
												>
													{
														this.state
															.description_category
													}
												</textarea>
											</div>
										</div>
									</div>
								</ModalBody>
								<div className='modal-footer'>
									<button
										className='btn btn-primary'
										onClick={() => {
											this.saveCategory()
										}}
									>
										Lưu
									</button>
								</div>
							</Modal>
						</div>
					</div>
				</div>
			</Fragment>
		)
	}
}

const mapStateToProps = (state) => ({
	error: state.error,
	auth: state.auth,
	item: state.item,
})

export default connect(mapStateToProps, {
	saveCategoryProduct,
	deleteCategoryProduct,
})(LoaiSanPham)
