import React from "react";
import { render } from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";

import rootReducer from "./reducers";
import Gmap from "./components/Gmap";
import InfoBox from "./components/InfoBox";
import PopupBox from "./components/PopupBox";

import "./style.scss";

const store = createStore(
	rootReducer,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

function App() {
	return (
		<div>
			<Gmap />
			<InfoBox />
			<PopupBox />
		</div>
	)

}

render(<Provider store={store}><App /></Provider>, document.getElementById("root"));