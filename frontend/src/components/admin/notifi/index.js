import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux'

import {
	changeConfig,
	saveConfig,
	layThongBao,
} from '../../../actions/itemActions'
class AdminThongBao extends Component {
	componentDidMount() {
		this.props.layThongBao()
	}
	onChange = (e) => {
		var adminConfig = this.props.item.adminConfig
		var data = {
			...adminConfig,
			[e.target.name]: e.target.value,
		}
		this.props.changeConfig(data)
	}
	saveConfig() {
		var adminConfig = this.props.item.adminConfig
		this.props.saveConfig(adminConfig)
	}
	render() {
		const { adminConfig } = this.props.item
		return (
			<Fragment>
				<div className='content'>
					<div className='block block-rounded block-bordered'>
						<div className='block-header block-header-default border-bottom'>
							<h3 className='block-title'>Config</h3>
						</div>
						<div className='block-content'>
							<div className='form-group'>
								<label>Thông báo</label>
								<textarea
									className='form-control'
									name='thongbao'
									value={adminConfig.thongbao}
									onChange={this.onChange}
								></textarea>
							</div>
							<div className='form-group'>
								<label>Token BM</label>
								<textarea
									className='form-control'
									name='token_bm'
									value={adminConfig.token_bm}
									onChange={this.onChange}
								></textarea>
							</div>
							<div className='form-group'>
								<label>Cookie BM</label>
								<textarea
									className='form-control'
									name='cookie_bm'
									value={adminConfig.cookie_bm}
									onChange={this.onChange}
								></textarea>
							</div>
							{/* <div className="form-group">
		                		<label>URL banking</label>
		                		<textarea className="form-control" name="url_bank" value={adminConfig.url_bank} onChange={this.onChange}></textarea>
		                	</div>
		                	<div className="form-group">
		                		<label>Cookie banking</label>
		                		<textarea className="form-control" name="cookie_bank" value={adminConfig.cookie_bank} onChange={this.onChange}></textarea>
		                	</div>
		                	<div className="form-group">
		                		<label>Dữ liệu banking</label>
		                		<textarea className="form-control" name="data_bank" value={adminConfig.data_bank} onChange={this.onChange}></textarea>
							</div> */}
							<div className='form-group'>
								<label>Link nhóm facebook</label>
								<input
									type='text'
									className='form-control'
									name='link_group_fb'
									value={adminConfig.link_group_fb}
									onChange={this.onChange}
								></input>
							</div>
							<div className='form-group'>
								<label>Link nhóm zalo</label>
								<input
									type='text'
									className='form-control'
									name='link_group_zalo'
									value={adminConfig.link_group_zalo}
									onChange={this.onChange}
								></input>
							</div>
							<div className='form-group'>
								<label>Link nhóm tele</label>
								<input
									type='text'
									className='form-control'
									name='link_group_tele'
									value={adminConfig.link_group_tele}
									onChange={this.onChange}
								></input>
							</div>
							<div className='form-group'>
								<label>Link backup</label>
								<input
									type='text'
									className='form-control'
									name='link_backup'
									value={adminConfig.link_backup}
									onChange={this.onChange}
								></input>
							</div>
							<div className='form-group'>
								<button
									className='btn btn-primary'
									onClick={() => {
										this.saveConfig()
									}}
								>
									Lưu
								</button>
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

export default connect(mapStateToProps, {
	changeConfig,
	saveConfig,
	layThongBao,
})(AdminThongBao)
