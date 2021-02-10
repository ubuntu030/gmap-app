/**
 * ACTION TYPE
 */
export const SET_MARKS_LIST = 'SET_MARKS_LIST';

export const IS_SHOW_POPBOX = 'IS_SHOW_POPBOX'
export const FETCH_POP_INFO_SUCCESS = 'FETCH_POP_INFO_SUCCESS';
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

