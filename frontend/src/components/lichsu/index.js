import React, { useState, useEffect } from 'react'
import {
	laylichsumua,
	downloadProduct,
	veiwProduct,
} from '../../actions/itemActions'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'

const LichSu = (props) => {
	console.log(props)

	const [isModalBrowseGroupsOpen, setIsModalBrowseGroupsOpen] =
		useState(false)

	useEffect(() => {
		laylichsumua()
	}, [])

	const openModalScanGroups = (status, e) => {
		setIsModalBrowseGroupsOpen(status)
	}

	const downloadData = (ids, name, sl) => {
		downloadProduct(ids, name, sl)
	}

	const convertDate = (date_create) => {
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

	const xemChiTiet = (id_sanpham) => {
		setIsModalBrowseGroupsOpen(true)
		veiwProduct(id_sanpham)
	}

	const formatMoney = (
		amount,
		decimalCount = 0,
		decimal = '.',
		thousands = ','
	) => {
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
				<>{row.description_category.slice(0, 30)}</>
			),
		},
		{
			text: 'Giá',
			dataField: 'price_buy',
			formatter: (cell, row, rowIndex) => (
				<>{formatMoney(row.price_buy)} VNĐ</>
			),
		},
		{
			text: 'Số lượng',
			dataField: 'soluongmua',
		},
		{
			text: 'Ngày mua',
			dataField: 'ngaymua',
			formatter: (cell, row, rowIndex) => <>{convertDate(row.ngaymua)}</>,
		},
		{
			text: 'Xem chi tiết',
			dataField: '',
			formatter: (cell, row, rowIndex) => (
				<>
					<button
						className='btn btn-sm btn-primary '
						data={row.index}
						onClick={() => {
							xemChiTiet(row.id_sanpham)
						}}
					>
						<i className='si si-eye'></i> Xem
					</button>
				</>
			),
		},
		{
			text: 'Hành động',
			formatter: (cell, row, rowIndex) => (
				<>
					<button
						className='btn btn-sm btn-primary '
						data={row.index}
						onClick={() => {
							downloadData(
								row.id_sanpham,
								row.name_category,
								row.soluongmua
							)
						}}
					>
						<i className='fa fa-download'></i> Tải xuống
					</button>
				</>
			),
		},
	]

	return (
		<div className='content'>
			<div className='block block-rounded block-bordered'>
				<div className='block-header block-header-default border-bottom'>
					<h3 className='block-title'>Lịch sử mua</h3>
				</div>
				<div className='block-content'>
					<div style={{ marginTop: '15px' }}>
						<BootstrapTable
							keyField='_id'
							// data={lichsumua}
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
		</div>
	)
}

export default LichSu
