import { SET_MARKS_LIST, SET_MY_LOC_PADDING, SET_MY_LOC_SUCCESS, DEL_MY_LOC, SORT_BY_DISTANCE } from "../actions";

const initialState = {
	markList: [],
	myLocation: null
};

const rootReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_MARKS_LIST:
			return { ...state, markList: [...action.payload] }
		case SET_MY_LOC_PADDING:
			return { ...state }
		case SET_MY_LOC_SUCCESS:
			return { ...state, myLocation: action.payload }
		case SORT_BY_DISTANCE:
			return { ...state, markList: action.payload.sort((a, b) => a.distant - b.distant) }
		case DEL_MY_LOC:
			return { ...state, myLocation: null }
		default:
			return state;
	}
}

export default rootReducer;