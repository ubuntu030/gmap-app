import { SET_MARKS_LIST, SET_MY_LOC_SUCCESS, DEL_MY_LOC, SORT_BY_DISTANCE, SET_MARKS_LIST_PADDING, SET_GUIDING,SET_STORE_LOC_SUCCESS } from "../actions";

const initialState = {
	markList: [],
	myLocation: null,
	storeLocationInfo: null,
	isPadding: false,
	isGuiding: false
};

const rootReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_MARKS_LIST_PADDING:
			return { ...state, isPadding: true }
		case SET_MARKS_LIST:
			return { ...state, markList: [...action.payload], isPadding: false }
		case SET_STORE_LOC_SUCCESS:
			return { ...state, storeLocationInfo: action.payload }
		case SET_MY_LOC_SUCCESS:
			return { ...state, myLocation: action.payload }
		case SORT_BY_DISTANCE:
			return { ...state, markList: action.payload.sort((a, b) => a.distance - b.distance), isPadding: false }
		case SET_GUIDING:
			return { ...state, isGuiding: action.payload };
		case DEL_MY_LOC:
			return { ...state, myLocation: null }
		default:
			return state;
	}
}

export default rootReducer;