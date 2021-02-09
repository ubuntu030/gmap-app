import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./InfoBox.scss";

const InfoBox = () => {
	const { markList } = useSelector(state => state);
	console.log(markList);
	return (
		<div className="info-box-container">
			<ul>
				{
					markList.map(item => (
						<li key={item.title}>{item.title}</li>
					))
				}
			</ul>
		</div>
	)
}

export default InfoBox;