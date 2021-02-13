import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { fetchPopInfoSuccess, fetchPopInfoPadding, setGuiding } from "../actions";
import "./InfoBox.scss";

import { findPlace, routeRender, cleanDirectionsRenderer, panToLocation } from "./Gmap";
import Icon from "./Icon";

const InfoBox = () => {
	const dispatch = useDispatch();
	const { markList, myLocation, isPadding } = useSelector(state => state.infoBoxRdcr);
	const [isClps, setIsClps] = useState(false);
	const storeClick = async (item) => {
		dispatch(fetchPopInfoPadding());
		const result = await findPlace(item.title, item.position);
		console.log(result);
		dispatch(fetchPopInfoSuccess(result));
	}
	// 建立路徑圖
	const routeClick = (p1, p2) => {
		if (p1 && p2) {
			routeRender(p1, p2);
		} else {
			dispatch(setGuiding(true));
		}
	}
	// 清除路徑圖
	const cleanRoute = () => cleanDirectionsRenderer();
	// 進入項目則顯示彈跳地標
	const handleMouseEnter = (marker) => {
		marker.setAnimation(google.maps.Animation.BOUNCE);
		marker.setIcon();
	}
	// 離開則清除彈跳地標
	const handleMouseLeave = (marker) => {
		marker.setAnimation(null);
		marker.setIcon(Icon.redDot);
	}
	// 將我位置至中於地圖上
	const handleFindMe = (location) => {
		panToLocation(location);
	}
	// infoBox 縮小功能
	const doCollapse = () => {
		setIsClps(!isClps);
		console.log(isClps);
	}

	return (
		<div className="info-box-container">
			<div className="location-ctn">
				{
					myLocation ?
						<div className="coordinate" onClick={() => { handleFindMe(myLocation) }}>
							{myLocation ? myLocation.lat().toFixed(3) + ',' + myLocation.lng().toFixed(3) : null}
						</div> : null
				}
				<div className="btn-fn-ctn">
					<button onClick={() => cleanRoute()}>清除路徑</button>
				</div>
				<div className="img-btn-ctn">
					<SwitchButton isActive={isClps} callback={doCollapse} />
				</div>
			</div>
			{
				isPadding ?
					<div className="loading-ctn">
						<div className="loading"></div>
					</div>
					:
					<ul className={isClps ? 'collapsed' : null}>
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
/**
 * switch Icon button
 * @param {Boolean} isActive 
 * @param {Function} callback 
 */
const SwitchButton = ({ isActive = false, callback }) => {
	return (
		<>
			{
				isActive ?
					<img onClick={() => callback()} src={Icon.plus} />
					: <img onClick={() => callback()} src={Icon.minus} />
			}
		</>
	)
}

export default InfoBox;