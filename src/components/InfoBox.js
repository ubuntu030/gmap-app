import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { fetchPopInfoSuccess, fetchPopInfoPadding } from "../actions";
import "./InfoBox.scss";

import { findPlace } from "./Gmap";

const InfoBox = () => {
	const dispatch = useDispatch();
	const { markList, myLocation } = useSelector(state => state.infoBoxRdcr);
	console.log(markList);
	const storeClick = async (item) => {
		dispatch(fetchPopInfoPadding());
		const result = await findPlace(item.title, item.position);
		console.log(result);
		dispatch(fetchPopInfoSuccess(result));
	}

	return (
		<div className="info-box-container">
			<div className="my-loc-ctn">
				<div>
					{myLocation ? myLocation.lat().toFixed(3) + ',' + myLocation.lng().toFixed(3) : null}
				</div>
			</div>
			<ul>
				{
					markList.map(item => (
						<li key={item.title} onClick={() => storeClick(item)}>
							<p>{item.title}</p>
							<p>{item.distance ? Math.round(item.distance) + '米' : null}</p>
						</li>
					))
				}
			</ul>
		</div>
	)
}

export default InfoBox;