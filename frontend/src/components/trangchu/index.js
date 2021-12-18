import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux'

import { getItems, layThongBaoClient } from '../../actions/itemActions'
import { clearErrors } from '../../actions/errorActions'
import Bm from './tabs/bm'

class TrangChu extends Component {
	state = {
		activeTab: 'bm',
	}
	componentDidMount() {
		this.props.getItems()
		this.props.layThongBaoClient()
	}
	activeTab(type) {
		this.setState({
			activeTab: type,
		})
	}
	render() {
		var notifi = this.props.item.notifi
		var content = <Bm />
		var thongbao = ''
		if (notifi.thongbao !== '') {
			thongbao = (
				<div className='alert alert-primary' role='alert'>
					<p className='mb-0'>
						Thông báo từ Admin: {notifi.thongbao}!
					</p>
				</div>
			)
		}
		var tabBm = (
			<a
				className='nav-link text-body-color'
				href='javascript:void(0)'
				onClick={() => {
					this.activeTab('bm')
				}}
			>
				<span className='d-none d-sm-inline'>
					Danh sách{' '}
					<span className='text-muted font-size-sm'>BM & VIA</span>
				</span>
			</a>
		)
		if (this.state.activeTab === 'bm') {
			tabBm = (
				<a
					className='nav-link text-body-color active'
					href='/'
					onClick={() => {
						this.activeTab('bm')
					}}
				>
					<span className='d-none d-sm-inline'>
						Danh sách{' '}
						<span className='text-muted font-size-sm'>BM</span>
					</span>
				</a>
			)
			content = <Bm />
		}
		return (
			<Fragment>
				{this.props.auth.user != null ? (
					<div className='content'>{thongbao}</div>
				) : (
					''
				)}
				{content}
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
	getItems,
	clearErrors,
	layThongBaoClient,
})(TrangChu)
