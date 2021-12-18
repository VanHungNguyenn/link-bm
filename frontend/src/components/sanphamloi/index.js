import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux'

import { getProductLoi } from '../../actions/itemActions'
import paginationFactory from 'react-bootstrap-table2-paginator'
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit'
import BootstrapTable from 'react-bootstrap-table-next'

class SanPham extends Component {
	state = {
		isModalBrowseGroupsOpen: false,
		id_fb: '',
		id_category: 0,
		data_product: '',
		id_product: '',
		deletearr: [],
		hidecheckbox: true,
		selected: '',
		listtype: '',
	}
	componentDidMount() {
		this.props.getProductLoi()
	}
	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value })
	}
	render() {
		const { listproductloi } = this.props.item
		function convertDate(date_create) {
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
		function formatNgayMua(cell, row) {
			return convertDate(row.date)
		}
		const columns = [
			{
				dataField: '',
				text: 'STT',
				sort: true,
				formatter: (cell, row, rowIndex) => <span>{rowIndex + 1}</span>,
			},
			{
				text: 'Tên tài khoản',
				dataField: 'data',
				formatter: (cell, row, rowIndex) => (
					<Fragment>{row.data.user_name}</Fragment>
				),
			},
			{
				text: 'Tiền trong tài khoản',
				dataField: 'data',
				formatter: (cell, row, rowIndex) => (
					<Fragment>
						{row.data.price + row.data.price_buy * row.data.sl}
					</Fragment>
				),
			},
			{
				text: 'Số lượng mua',
				dataField: 'data',
				formatter: (cell, row, rowIndex) => (
					<Fragment>{row.data.sl}</Fragment>
				),
			},
			{
				text: 'Tiền mua sản phẩm',
				dataField: 'data',
				formatter: (cell, row, rowIndex) => (
					<Fragment>{row.data.price_buy * row.data.sl}</Fragment>
				),
			},
			{
				text: 'Lỗi',
				dataField: 'data',
				formatter: (cell, row, rowIndex) => (
					<Fragment>{row.msg.msg}</Fragment>
				),
			},
			{
				text: 'Ngày lỗi',
				dataField: 'data',
				formatter: formatNgayMua,
				filterValue: formatNgayMua,
			},
		]
		const { SearchBar } = Search
		return (
			<Fragment>
				<div className='content'>
					<div className='block block-rounded block-bordered'>
						<div className='block-header block-header-default border-bottom'>
							<h3 className='block-title'>
								Quản lý sản phẩm lỗi
							</h3>
						</div>
						<div className='block-content'>
							<div style={{ marginTop: '15px' }}>
								<ToolkitProvider
									keyField='_id'
									search
									data={listproductloi}
									columns={columns}
								>
									{(props) => (
										<div>
											<SearchBar {...props.searchProps} />
											<BootstrapTable
												{...props.baseProps}
												pagination={paginationFactory()}
											/>
										</div>
									)}
								</ToolkitProvider>
							</div>
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

export default connect(mapStateToProps, { getProductLoi })(SanPham)
