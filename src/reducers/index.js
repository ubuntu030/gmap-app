import { combineReducers } from "redux";
import infoBoxRdcr from "./infoBoxRdcr";
import popBoxRdcr from "./popBoxRdcr";

// NOTICE: combineReducers have to use multiple reducer,otherwise it can't do initial state when I tyr to useSelector in component first time.
const rootReducer = combineReducers({
	infoBoxRdcr,
	popBoxRdcr
});
export default rootReducer;
