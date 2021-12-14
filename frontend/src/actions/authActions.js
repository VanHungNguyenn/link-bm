import axios from 'axios';
import { returnErrors } from './errorActions';

import {
	USER_LOADED,
	USER_LOADING,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT_SUCCESS,
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	CHANGE_SIDEBAR,
	CHANGE_MENUPROFILE
} from "./types";

// Check token & load user
export const loadUser = () => (dispatch, getState) => {
	// User loading
	const token = getState().auth.token;
	if (token) {
		dispatch({ type: USER_LOADING });
		axios.get('/api/auth/user', tokenConfig(getState))
			.then(res => dispatch({
				type: USER_LOADED,
				payload: res.data
			}))
			.catch(err => {
				dispatch(returnErrors(err.response.data, err.response.status));
				dispatch({
					type: AUTH_ERROR
				});
				window.location.reload();
			});
	}
}

// Register User
export const register = ({ name, phone, password, repeatpassword }) => dispatch => {
	// Headers
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	}
	
	// Request body
	const body = JSON.stringify({ name, phone, password, repeatpassword });
	
	axios
		.post('/api/users', body, config)
		.then((res) =>{
			dispatch(
				returnErrors('Tạo tài khoản thành công!', 200, 'REGISTER_SUCCESS')
			);
			dispatch({
				type: REGISTER_SUCCESS,
				payload: res.data
			})
		})
		.catch(err => {
			dispatch(
				returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL')
			);
			dispatch({
				type: REGISTER_FAIL
			});
		});
	
}

// Register User
export const registerUser = ({ name, phone, password, repeatpassword }) => dispatch => {
	// Headers
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	}
	
	// Request body
	const body = JSON.stringify({ name, phone, password, repeatpassword });
	
	axios
		.post('/api/users', body, config)
		.then((res) =>{
			dispatch(
				returnErrors('Tạo tài khoản thành công!', 200, 'REGISTER_SUCCESS')
			);
			dispatch(loadUser());
		})
		.catch(err => {
			dispatch(
				returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL')
			);
		});
	
}

// Login User
export const login = ({ name, password }) => dispatch => {
	// Headers
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	}
	
	// Request body
	const body = JSON.stringify({ name, password });
	
	axios
		.post('/api/auth', body, config)
		.then((res) =>{
			dispatch({
				type: LOGIN_SUCCESS,
				payload: res.data
			})
			dispatch(returnErrors('Đăng nhập thành công!', 200, 'LOGIN_SUCCESS'))
		})
		.catch(err => {
			dispatch(
				returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL')
			);
			dispatch({
				type: LOGIN_FAIL
			});
		});
	
}

// Logout User
export const logout = () => {
	return {
		type: LOGOUT_SUCCESS
	};
};

export const changeSidebar = (isOpen) => dispatch => {
	dispatch ({
		type: CHANGE_SIDEBAR,
		payload: isOpen
	});
};

export const changeMenuProfile = (isOpen) => dispatch => {
	dispatch ({
		type: CHANGE_MENUPROFILE,
		payload: isOpen
	});
};

export const updateUserInfo = (body) => (dispatch) => {
	dispatch({
		type: 'UPDATE_USERINFO',
		payload: body
	})
};

export const saveDataUser = (data) => (dispatch, getState) => {
	let bodysend = {
		dataform: data,
	}

	axios.post('/api/auth/user_save_info', bodysend, tokenConfig(getState)).then(res => {
		if (res.data.status === 200) {
			dispatch(
				returnErrors('Sửa thành công', 200)
			);
			window.location.reload();
		} else {
			dispatch(
				returnErrors(res.data.msg, 400)
			);
		}
	});
};

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