import React from "react";
import { render } from "react-dom";

import Gmap from "./components/Gmap";

import "./style.scss";

function App() {
	return (
		<div>
			<Gmap />
		</div>
	)

}

render(<App />, document.getElementById("root"));