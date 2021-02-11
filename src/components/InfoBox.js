import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { fetchPopInfoSuccess, fetchPopInfoPadding } from "../actions";
import "./InfoBox.scss";

import { findPlace } from "./Gmap";

const InfoBox = () => {
	const dispatch = useDispatch();
	const { markList } = useSelector(state => state.infoBoxRdcr);
	console.log(markList);
	const storeClick = async (item) => {
		dispatch(fetchPopInfoPadding());
		const result = await findPlace(item.title, item.position);
		console.log(result);
		dispatch(fetchPopInfoSuccess(result));
	}

	return (
		<div className="info-box-container">
			<div>
				<label>where am I?</label>
				<button>Set my location</button>
			</div>
			<ul>
				{
					markList.map(item => (
						<li key={item.title} onClick={() => storeClick(item)}>{item.title}</li>
					))
				}
			</ul>
		</div>
	)
}

export default InfoBox;