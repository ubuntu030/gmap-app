import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import { fetchPopInfoSuccess, fetchPopInfoPadding, setStoreLocationInfo, setGuiding } from "../actions";
import "./InfoBox.scss";

import { findPlace, routeRender, cleanDirectionsRenderer, panToLocation, filterMarker } from "./Gmap";
import Icon from "./Icon";

const InfoBox = () => {
	const dispatch = useDispatch();
	const { markList, myLocation, isPadding, storeLocationInfo } = useSelector(state => state.infoBoxRdcr);
	const [isClps, setIsClps] = useState(false);
	const [slctMarker, setSlctMarker] = useState(null);
	const ulElm = useRef(null);
	// 點選商家並取回資料後發送新的狀態
	const storeClick = async (item) => {
		dispatch(fetchPopInfoPadding());
		const result = await findPlace(item.title, item.position);
		console.log(result);
		dispatch(fetchPopInfoSuccess(result));
		dispatch(setStoreLocationInfo({ title: item.title, location: item.position }));
		const mkr = filterMarker(item.title);
		setSlctMarker(mkr);
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
	// 將目標位置至中於地圖上
	const handleFindLocation = (location) => {
		panToLocation(location);
	}
	// infoBox 縮小功能
	const doCollapse = () => {
		setIsClps(!isClps);
		console.log(isClps);
	}

	const findStoreOnList = (title) => {
		let filterElm = null;
		if (ulElm && title) {
			const elms = ulElm.current.children;
			let elm = null;
			let targetText = '';
			for (let index = 0; index < elms.length; index++) {
				elm = elms[index];
				targetText = elm.querySelector('.title').innerText;
				if (targetText === title) {
					filterElm = elm;
					elm.scrollIntoView();
					break;
				}
			}
		}
		return filterElm;
	}

	return (
		<main className="info-box-container">
			<section className="location-ctn">
				<div className="div-1">
					{
						myLocation ?
							<div className="coordinate" onClick={() => { handleFindLocation(myLocation) }}>
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
					storeLocationInfo && storeLocationInfo.title ?
						<div className="store">
							<p onClick={() => findStoreOnList(storeLocationInfo.title)}>
								{storeLocationInfo.title}
							</p>
							<button
								onMouseEnter={() => handleMouseEnter(slctMarker[0])}
								onMouseLeave={() => handleMouseLeave(slctMarker[0])}
								onClick={() => handleFindLocation(storeLocationInfo.location)}>
								{storeLocationInfo.location.lat().toFixed(3) + ',' + storeLocationInfo.location.lng().toFixed(3)}
							</button>
						</div> : null
				}
			</section>
			{
				isPadding ?
					<div className="loading-ctn">
						<div className="loading"></div>
					</div>
					:
					<ul ref={ulElm} className={isClps ? 'collapsed' : null}>
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

		</main>
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