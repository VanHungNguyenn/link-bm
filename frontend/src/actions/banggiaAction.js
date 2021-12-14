import axios from 'axios';
// import {
	// TAIKHOAN_LOADED,
	// PUSH_EDIT_TAIKHOAN,
// } from './types';

import toastr from 'reactjs-toastr';
import { loadUser } from './authActions';

export const muaGoi = (body) => (dispatch, getState) => {
	axios.post('/api/banggia/mua', body, tokenConfig(getState))
		.then(res => {
			if (res.data.status === '200') {
				toastr.success(res.data.msg, 'Thành công', {displayDuration:3000});
			} else {
				toastr.error(res.data.msg, 'Lỗi', {displayDuration:3000});
			}
			dispatch(loadUser());
		});
}

// Setup config/headers and token
export const tokenConfig = getState => {
	// Get token from localhost
	const token = getState().auth.token;
	
	// Headers
	const config = {
		headers: {
			"Content-type": "application/json"
		}
	};
	
	// If token, add to headers
	if (token) {
		config.headers['zi-token'] = token;
	}
	
	return config;
};