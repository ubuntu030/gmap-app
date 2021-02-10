/**
 * ACTION TYPE
 */
export const SET_MARKS_LIST = 'SET_MARKS_LIST';

export const IS_SHOW_POPBOX = 'IS_SHOW_POPBOX'
export const FETCH_POP_INFO_PADDING = 'FETCH_POP_INFO_PADDING';
export const FETCH_POP_INFO_SUCCESS = 'FETCH_POP_INFO_SUCCESS';
export const FETCH_POP_INFO_ERROR = 'FETCH_POP_INFO_ERROR';
/**
 * INFOBOX ACTION
 */
export const setMarksList = (list) => {
	return {
		type: SET_MARKS_LIST,
		payload: list
	}
}
/**
 * POPBOX ACTION
 */
export const fetchPopInfoPadding = () => {
	return {
		type: FETCH_POP_INFO_PADDING,
	}
}
export const fetchPopInfoSuccess = (info) => {
	return {
		type: FETCH_POP_INFO_SUCCESS,
		payload: info
	}
}
export const isShowPopbox = (isShow) => {
	return {
		type: IS_SHOW_POPBOX,
		payload: isShow
	}
}

