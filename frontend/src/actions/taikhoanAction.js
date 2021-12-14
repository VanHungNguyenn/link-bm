import axios from 'axios';
import {
	TAIKHOAN_LOADED,
	PUSH_EDIT_TAIKHOAN,
} from './types';

import toastr from 'reactjs-toastr';
import { returnErrors } from './errorActions';
export const getListDataTaiKhoan = () => (dispatch, getState) => {
	const config = tokenConfig(getState);
	axios.get('/api/taikhoan/', config)
		.then(res => {
			dispatch({
				type: TAIKHOAN_LOADED,
				payload: res.data
			})
		});
}
// Register User
export const registerUser = ({ name, phone, password, repeatpassword }) => (dispatch, getState) => {
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
	
	// Request body
	const body = JSON.stringify({ name, phone, password, repeatpassword });
	
	axios
		.post('/api/users', body, config)
		.then((res) =>{
			dispatch(
				returnErrors('Tạo tài khoản thành công!', 200, 'REGISTER_SUCCESS')
			);
			dispatch(getListDataTaiKhoan());
		})
		.catch(err => {
			dispatch(
				returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL')
			);
		});
	
}
// Register User
export const xoaTaiKhoan = (id) => (dispatch,getState) => {
	// Headers
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
	
	// Request body
	const body = {
		id:id
	};
	
	axios
		.post('/api/auth/delete', body, config)
		.then((res) =>{
			dispatch(
				returnErrors('Xoá tài khoản thành công!', 200, 'DELETE_SUCCESS')
			);
			dispatch(getListDataTaiKhoan());
		})
		.catch(err => {
			dispatch(
				returnErrors(err.response.data, err.response.status, 'DELETE_FAIL')
			);
		});
	
}


export const historyUser = (id) => (dispatch, getState) => {
	const token = getState().auth.token;
	const dataPass = {
	    params: {
	      	idUser: id
	    },
	    headers: {
	    	"Content-type": "application/json",
	    }
  	}
	if (token) {
		dataPass.headers['zi-token'] = token;
	}

	axios.get('/api/fbmark/logs', dataPass).then(res =>{
		dispatch({
			type: 'LAY_LICH_SU_MUA',
			payload: res.data
		})
	})
};
export const datlaiMatKhau = (body) => (dispatch, getState) => {
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
	axios
		.post('/api/auth/editpass', body, config)
		.then((res) =>{
			dispatch(
				returnErrors('thay đổi mật khẩu tài khoản thành công!', 200, 'EDIT_SUCCESS')
			);
			dispatch(getListDataTaiKhoan());
		})
		.catch(err => {
			dispatch(
				returnErrors(err.response.data, err.response.status, 'EDIT_FAIL')
			);
		});
	
}

export const editTaiKhoanfunc = (body) => (dispatch, getState) => {
	axios.post('/api/taikhoan/edit', body, tokenConfig(getState))
		.then(res => {
			if (res.data.status == 200) {
				toastr.success(res.data.msg, 'Thành công', {displayDuration:3000});
			} else {
				toastr.error(res.data.msg, 'Lỗi', {displayDuration:3000});
			}
			
			dispatch(getListDataTaiKhoan());
		});
}

export const getDataTaiKhoan = (body) => (dispatch, getState) => {
	dispatch({
		type: PUSH_EDIT_TAIKHOAN,
		payload: body
	})
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