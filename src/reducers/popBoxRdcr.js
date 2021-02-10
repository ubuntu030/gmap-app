import { IS_SHOW_POPBOX, FETCH_POP_INFO_SUCCESS } from "../actions";
const initialState = {
	isShow: false,
	info: null
};

const rootReducer = (state = initialState, action) => {
	switch (action.type) {
		case IS_SHOW_POPBOX:
			return { ...state }
		case FETCH_POP_INFO_SUCCESS:
			return { ...state, isShow: true, info: action.payload[0] }
		default:
			return state;
	}
}

export default rootReducer;