import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux'

import {
	laylichsumua,
	downloadProduct,
	veiwProduct,
} from '../../actions/itemActions'

import paginationFactory from 'react-bootstrap-table2-paginator'

import BootstrapTable from 'react-bootstrap-table-next'

import { Modal, ModalBody } from 'reactstrap'

// const myNewTheme = {
// 	headCells: {
// 		style: {
// 			fontWeight: 'bold',
// 			fontSize: '14px',
// 		},
// 	},
// }
class LichSuMua extends Component {
	state = {
		isModalBrowseGroupsOpen: false,
	}
	componentDidMount() {
		this.props.laylichsumua()
	}
	openModalScanGroups = (status, e) => {
		this.setState({
			isModalBrowseGroupsOpen: status,
		})
	}
	downloadData(ids, name, sl) {
		this.props.downloadProduct(ids, name, sl)
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
	xemChiTiet(id_sanpham) {
		this.setState({
			isModalBrowseGroupsOpen: true,
		})
		this.props.veiwProduct(id_sanpham)
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
		// console.log(this.props.item)
		const { lichsumua, viewProduct } = this.props.item
		const columns = [
			{
				dataField: '',
				text: 'STT',
				sort: true,
				formatter: (cell, row, rowIndex) => <span>{rowIndex + 1}</span>,
			},
			{
				text: 'Loại sản phẩm',
				dataField: 'name_category',
			},
			{
				text: 'Miêu tả',
				dataField: 'description_category',
				formatter: (cell, row, rowIndex) => (
					<Fragment>{row.description_category.slice(0, 30)}</Fragment>
				),
			},
			{
				text: 'Giá',
				dataField: 'price_buy',
				formatter: (cell, row, rowIndex) => (
					<Fragment>{this.formatMoney(row.price_buy)} VNĐ</Fragment>
				),
			},
			{
				text: 'Số lượng',
				dataField: 'soluongmua',
			},
			{
				text: 'Ngày mua',
				dataField: 'ngaymua',
				formatter: (cell, row, rowIndex) => (
					<Fragment>{this.convertDate(row.ngaymua)}</Fragment>
				),
			},
			{
				text: 'Xem chi tiết',
				dataField: '',
				formatter: (cell, row, rowIndex) => (
					<Fragment>
						<button
							className='btn btn-sm btn-primary '
							data={row.index}
							onClick={() => {
								this.xemChiTiet(row.id_sanpham)
							}}
						>
							<i className='si si-eye'></i> Xem
						</button>
					</Fragment>
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
								this.downloadData(
									row.id_sanpham,
									row.name_category,
									row.soluongmua
								)
							}}
						>
							<i className='fa fa-download'></i> Tải xuống
						</button>
					</Fragment>
				),
			},
		]
		var listproduct = (
			<Fragment>
				{viewProduct.map(function (value, index) {
					return <li key={index}>{value.data}</li>
				})}
			</Fragment>
		)
		return (
			<Fragment>
				<div className='content'>
					<div className='block block-rounded block-bordered'>
						<div className='block-header block-header-default border-bottom'>
							<h3 className='block-title'>Lịch sử mua</h3>
						</div>
						<div className='block-content'>
							<div style={{ marginTop: '15px' }}>
								<BootstrapTable
									keyField='_id'
									data={lichsumua}
									columns={columns}
									striped
									hover
									wrapperClasses='table-responsive'
									pagination={paginationFactory()}
									search={{ searchFormatted: true }}
								/>
							</div>
						</div>
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
							<p className='mb-0 text-dark'>Chi tiết sản phẩm</p>
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
									<ul style={{ 'list-style': 'decimal' }}>
										{listproduct}
									</ul>
								</div>
							</div>
						</ModalBody>
					</Modal>
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
	laylichsumua,
	downloadProduct,
	veiwProduct,
})(LichSuMua)
