const initialState = {
	markList: []
};

const rootReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_MARKS_LIST':
			return { ...state, markList: [...action.payload] }
		default:
			return state;
	}
}

export default rootReducer;