import { SET_MARKS_LIST, SET_MY_LOC_SUCCESS, DEL_MY_LOC, SORT_BY_DISTANCE,SET_MARKS_LIST_PADDING } from "../actions";

const initialState = {
	markList: [],
	myLocation: null,
	isPadding: false
};

const rootReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_MARKS_LIST_PADDING:
			return { ...state, isPadding: true }
		case SET_MARKS_LIST:
			return { ...state, markList: [...action.payload], isPadding: false }
		case SET_MY_LOC_SUCCESS:
			return { ...state, myLocation: action.payload }
		case SORT_BY_DISTANCE:
			return { ...state, markList: action.payload.sort((a, b) => a.distance - b.distance) }
		case DEL_MY_LOC:
			return { ...state, myLocation: null }
		default:
			return state;
	}
}

export default rootReducer;