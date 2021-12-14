import { GET_ITEMS, ADD_ITEM, DELETE_ITEM, ITEMS_LOADING } from '../actions/types';

const initialState = {
	items: [],
	product: [],
	productAmin: [], 
	lichsumua: [],
	adminlogs: [],
	admintongdoanhthu: [],
	admindespit: [],
	lichsunap: [],
	adminnotifi: [],
	notifi: {
		thongbao: '',
		cookie_bm: '',
		token_bm: '',
		link_backup: '',
		link_group_fb: '',
		link_group_zalo: '',
		link_group_tele: ''
	},
	checkBm: [],
	viewProduct: [],
	adminConfig: {
		_id: '',
		thongbao: '',
		cookie_bm: '',
		token_bm: '',
		link_backup: '',
		url_bank: '',
		cookie_bank: '',
		data_bank: '',
		link_group_fb: '',
		link_group_zalo: '',
		link_group_tele: ''
	},
	loading: false,
	totalmoney: 0,
	listproductloi: [],
};

export default function(state = initialState, action) {
	switch(action.type) {
		case GET_ITEMS:
			return {
				...state,
				items: action.payload,
				loading: false
			}
		case DELETE_ITEM:
			return {
				...state,
				items: state.items.filter(item => item._id !== action.payload)
			}
		case ADD_ITEM:
			return {
				...state,
				items: [action.payload, ...state.items]
			}
		case 'GET_PRODUCT':
			return {
				...state,
				product: action.payload
			}
		case 'GET_PRODUCT_ADMIN':
			return {
				...state,
				productAmin: action.payload
			}
		case 'VIEW_PRODUCT':
			return {
				...state,
				viewProduct: action.payload
			}
		case 'LAY_LICH_SU_MUA':
			return {
				...state,
				lichsumua: action.payload
			}
		case 'ADMIN_LAY_LICH_SU_MUA':
			return {
				...state,
				adminlogs: action.payload
			}
		case 'ADMIN_LAY_TONG_DOANH_THU':
			return {
				...state,
				admintongdoanhthu: action.payload
			}
		case 'DATA_CHECK_BM':
			return {
				...state,
				checkBm: [action.payload, ...state.checkBm]
			}
		case 'ADMIN_LAY_LICH_SU_NAP':
			return {
				...state,
				admindespit: action.payload
			}
		case 'LAY_LICH_SU_NAP':
			return {
				...state,
				lichsunap: action.payload
			}
		case 'ADMIN_LAY_THONG_BAO':
			return {
				...state,
				adminConfig: action.payload
			}
		case 'CHANGE_CONFIG':
			return {
				...state,
				adminConfig: action.payload
			}
		case 'LAY_THONG_BAO':
			return {
				...state,
				notifi: action.payload
			}
		case ITEMS_LOADING:
			return {
				...state,
				loading: action.payload
			}
		case "TOTAL_MONEY":
			return {
				...state,
				totalmoney: action.payload
			}
		case "LIST_PRODUCT_LOI":
			return {
				...state,
				listproductloi: action.payload
			}
		default:
			return state;
	}
}