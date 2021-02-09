const SET_MARKS_LIST = 'SET_MARKS_LIST';

export const setMarksList = (list) => {
	return {
		type: SET_MARKS_LIST,
		payload: list
	}
}