import { SET_MARKS_LIST, SET_MY_LOC_PADDING, SET_MY_LOC_SUCCESS, DEL_MY_LOC } from "../actions";

const initialState = {
	markList: [],
	myLocationOnSetting: false,
	myLocation: null
};

const rootReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_MARKS_LIST:
			return { ...state, markList: [...action.payload] }
		case SET_MY_LOC_PADDING:
			return { ...state, myLocationOnSetting: true }
		case SET_MY_LOC_SUCCESS:
			return { ...state, myLocationOnSetting: false, my_location: action.payload }
		case DEL_MY_LOC:
			return { ...state, my_location: null }
		default:
			return state;
	}
}

export default rootReducer;