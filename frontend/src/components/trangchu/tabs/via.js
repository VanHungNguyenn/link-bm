import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux'

class Via extends Component {
	render() {
		return (
			<Fragment>
				<div>bbbbbbbbbbbbbbbbbbb</div>
			</Fragment>
		)
	}
}

const mapStateToProps = (state) => ({
	auth: state.auth,
})

export default connect(mapStateToProps, {})(Via)
