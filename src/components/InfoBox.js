import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { fetchPopInfoSuccess, fetchPopInfoPadding } from "../actions";
import "./InfoBox.scss";

import { findPlace, routeRender, cleanDirectionsRenderer } from "./Gmap";
import Icon from "./Icon";

const InfoBox = () => {
	const dispatch = useDispatch();
	const { markList, myLocation, isPadding } = useSelector(state => state.infoBoxRdcr);
	const storeClick = async (item) => {
		dispatch(fetchPopInfoPadding());
		const result = await findPlace(item.title, item.position);
		console.log(result);
		dispatch(fetchPopInfoSuccess(result));
	}

	const routeClick = (p1, p2) => {
		if (p1 && p2) {
			routeRender(p1, p2);
		}
	}
	const cleanRoute = () => cleanDirectionsRenderer();

	const handleMouseEnter = (marker) => {
		marker.setAnimation(google.maps.Animation.BOUNCE);
		marker.setIcon();
	}
	const handleMouseLeave = (marker) => {
		marker.setAnimation(null);
		marker.setIcon(Icon.redDot);
	}
	return (
		<div className="info-box-container">
			<div className="location-ctn">
				<div className="coordinate">
					{myLocation ? myLocation.lat().toFixed(3) + ',' + myLocation.lng().toFixed(3) : null}
				</div>
				<div>
					<button onClick={() => cleanRoute()}>清除路徑</button>
				</div>
			</div>
			{
				isPadding ?
					<div className="loading-ctn">
						<div className="loading"></div>
					</div>
					:
					<ul>
						{
							markList.map(item => (
								<li key={item.title} onMouseEnter={() => handleMouseEnter(item)} onMouseLeave={() => handleMouseLeave(item)}>
									<div className="title" onClick={() => storeClick(item)}>
										{item.title}
									</div>
									<div className="loc-relation-ctn">
										<div>
											{item.distance ? Math.round(item.distance) + '米' : null}
										</div>
										<div>
											<button onClick={() => routeClick(myLocation, item.position)}>導航</button>
										</div>
									</div>
								</li>
							))
						}
					</ul>
			}

		</div>
	)
}

export default InfoBox;