import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux'

import { laylichsunaptien } from '../../actions/itemActions'

import paginationFactory from 'react-bootstrap-table2-paginator'
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit'
import BootstrapTable from 'react-bootstrap-table-next'

const { SearchBar } = Search

class LichSuNaptien extends Component {
	componentDidMount() {
		this.props.laylichsunaptien()
	}
	render() {
		const { lichsunap } = this.props.item
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
		function formatMoney(
			amount,
			decimalCount = 0,
			decimal = '.',
			thousands = ','
		) {
			try {
				decimalCount = Math.abs(decimalCount)
				decimalCount = isNaN(decimalCount) ? 2 : decimalCount

				const negativeSign = amount < 0 ? '-' : ''

				let i = parseInt(
					(amount = Math.abs(Number(amount) || 0).toFixed(
						decimalCount
					))
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
		function formatNgayNap(cell, row) {
			return convertDate(row.thoigian_nap)
		}
		function formatTienNap(cell, row) {
			return formatMoney(row.tien_nap) + ' VNĐ'
		}
		const columns = [
			{
				dataField: '',
				text: 'STT',
				sort: true,
				formatter: (cell, row, rowIndex) => <span>{rowIndex + 1}</span>,
			},
			{
				text: 'Mã nạp',
				dataField: 'ma_nap',
			},
			{
				text: 'Nội dung',
				dataField: 'noidung',
				formatter: (cell, row, rowIndex) => (
					<Fragment>{row.noidung.slice(0, 30)}</Fragment>
				),
			},
			{
				text: 'Tiền nạp',
				dataField: 'tien_nap',
				formatter: formatTienNap,
				filterValue: formatTienNap,
			},
			{
				text: 'Ngày nạp',
				dataField: 'thoigian_nap',
				formatter: formatNgayNap,
				filterValue: formatNgayNap,
			},
		]
		return (
			<Fragment>
				<div className='content'>
					<div className='block block-rounded block-bordered'>
						<div className='block-header block-header-default border-bottom'>
							<h3 className='block-title'>Lịch sử nạp tiền</h3>
						</div>
						<ToolkitProvider
							keyField='_id'
							data={lichsunap}
							columns={columns}
							search
						>
							{(props) => (
								<div>
									<SearchBar {...props.searchProps} />
									<BootstrapTable
										{...props.baseProps}
										pagination={paginationFactory()}
										wrapperClasses='table-responsive'
										striped
										hover
										condensed
									/>
								</div>
							)}
						</ToolkitProvider>
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

export default connect(mapStateToProps, { laylichsunaptien })(LichSuNaptien)
