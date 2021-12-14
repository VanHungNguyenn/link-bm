import {
	TAIKHOAN_LOADED,
	PUSH_SELECTED_TAIKHOAN,
	PUSH_EDIT_TAIKHOAN,
} from "../actions/types";
const initalState = {
	isLoading: false,
	listtaikhoan: [],
	selectedtaikhoan: [],
	edittaikhoan: {
		"_id": "",
		"name": "",
		"email": "",
		"balance": 0,
		"thembot": "",
		"thembot_value": 0,
	}
};
const taikhoanReducer = (state = initalState, action) => {
    switch (action.type) {
        case TAIKHOAN_LOADED:
            return {
                ...state,
                isLoading: false,
				listtaikhoan: action.payload,
            };
        case PUSH_SELECTED_TAIKHOAN:
            return {
                ...state,
                isLoading: false,
				selectedtaikhoan: action.payload,
            };
        case PUSH_EDIT_TAIKHOAN:
            return {
                ...state,
                isLoading: false,
				edittaikhoan: action.payload,
            };
        default:
            return state;
    }
};

export default taikhoanReducer;
