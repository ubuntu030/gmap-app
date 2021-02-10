import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { fetchPopInfoSuccess,fetchPopInfoPadding} from "../actions";
import "./InfoBox.scss";

import { findPlace } from "./Gmap";

const InfoBox = () => {
	const dispatch = useDispatch();
	const { markList } = useSelector(state => state.infoBoxRdcr);
	console.log(markList);
	const _onClick = async (item) => {
		dispatch(fetchPopInfoPadding());
		const result = await findPlace(item.title);
		console.log(result);
		dispatch(fetchPopInfoSuccess(result));
	}

	return (
		<div className="info-box-container">
			<ul>
				{
					markList.map(item => (
						<li key={item.title} onClick={() => _onClick(item)}>{item.title}</li>
					))
				}
			</ul>
		</div>
	)
}

export default InfoBox;