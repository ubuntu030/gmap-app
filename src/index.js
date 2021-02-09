import React from "react";
import { render } from "react-dom";

import Gmap from "./components/Gmap";
import InfoBox from "./components/InfoBox";

import "./style.scss";

function App() {
	return (
		<div>
			<Gmap />
			<InfoBox />
		</div>
	)

}

render(<App />, document.getElementById("root"));