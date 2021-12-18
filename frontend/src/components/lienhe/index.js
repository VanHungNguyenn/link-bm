import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux'

import { layThongBaoClient } from '../../actions/itemActions'
class LienHe extends Component {
	componentDidMount() {
		this.props.layThongBaoClient()
	}
	render() {
		var notifi = this.props.item.notifi
		return (
			<Fragment>
				<div className='content'>
					<div className='block block-rounded block-bordered'>
						<div
							className='alert alert-warning'
							style={{ textAlign: 'center' }}
						>
							<h6>
								Link vào nhóm facebook:{' '}
								<a href={notifi.link_group_fb}>
									{notifi.link_group_fb}
								</a>
							</h6>
							<h6>
								Link vào nhóm telegram:{' '}
								<a href={notifi.link_group_tele}>
									{notifi.link_group_tele}
								</a>
							</h6>
							<h6>
								Link vào nhóm zalo:{' '}
								<a href={notifi.link_group_zalo}>
									{notifi.link_group_zalo}
								</a>
							</h6>
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

export default connect(mapStateToProps, { layThongBaoClient })(LienHe)
