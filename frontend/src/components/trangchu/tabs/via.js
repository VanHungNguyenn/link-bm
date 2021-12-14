import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
class Via extends Component {
	
	render() {
		
		return (
			<Fragment>
				<div>
					bbbbbbbbbbbbbbbbbbb
                </div>
			</Fragment>
		)
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
});

export default connect(mapStateToProps, {})(Via);