import {
	USER_LOADED,
	// USER_LOADING,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT_SUCCESS,
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	CHANGE_SIDEBAR,
	CHANGE_MENUPROFILE
} from "../actions/types";

const initialState = {
	token: localStorage.getItem('token'),
	isAuthenticated: localStorage.getItem('isAuthenticated'),
	isLoading: false,
	isOpenSidebar: true,
	isOpenMenuProfile: false,
	user: JSON.parse(localStorage.getItem('user')),
	edituser: {
		_id: '',
		phone: '',
		old_pass: '',
		new_pass: '',
		re_pass: '',
	}
}

export default function(state = initialState, action) {
	switch(action.type) {
		case USER_LOADED:
			return {
				...state,
				isAuthenticated: true,
				isLoading: false,
				user: action.payload
			}
		case CHANGE_SIDEBAR:
			return {
				...state,
				isOpenSidebar: action.payload
			};
		case CHANGE_MENUPROFILE:
			return {
				...state,
				isOpenMenuProfile: action.payload
			};
		case 'UPDATE_USERINFO':
			return {
				...state,
				edituser: action.payload
			}
		case LOGIN_SUCCESS:
		case REGISTER_SUCCESS:
			localStorage.setItem('token', action.payload.token);
			localStorage.setItem('user', JSON.stringify(action.payload.user));
			localStorage.setItem('isAuthenticated', true);
			return {
				...state,
				...action.payload,
				isAuthenticated: true,
				isLoading: false,
			};
		case AUTH_ERROR:
		case LOGIN_FAIL:
		case LOGOUT_SUCCESS:
		case REGISTER_FAIL:
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			localStorage.removeItem('isAuthenticated');
			return {
				...state,
				token: null,
				user: null,
				isAuthenticated: false,
				isLoading: false
			}
		default:
			return state;
	}
}