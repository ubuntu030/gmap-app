import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import "./PopupBox.scss";



const PopupBox = () => {
	const dispatch = useDispatch();
	const { isShow, info } = useSelector(state => state.popBoxRdcr);
	return (
		<main className="popup-box">
			<section className="header card">
				header
			</section>
			<section className="container card">
				container
			</section>
		</main>
	)
}

export default PopupBox;