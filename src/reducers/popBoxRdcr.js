import { IS_SHOW_POPBOX, FETCH_POP_INFO_SUCCESS,FETCH_POP_INFO_PADDING } from "../actions";
const initialState = {
	isShow: false,
	info: null,
	loading: false,
};

const rootReducer = (state = initialState, action) => {
	switch (action.type) {
		case IS_SHOW_POPBOX:
			return { ...state, isShow: action.payload }
		case FETCH_POP_INFO_PADDING:
			return { ...state, loading: true }
		case FETCH_POP_INFO_SUCCESS:
			return { ...state, isShow: true, info: action.payload[0], loading: false }
		default:
			return state;
	}
}

export default rootReducer;