// https://developers.google.com/maps/documentation/javascript/places#find_place_from_query
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setMarksList, setMarksListPadding, setMyLocation, sortByDistance } from "../actions";
import { URL } from "./GmapAPI";
import Icon from "./Icon";

let googleMap = null;
let markers = [];
let dispatch = null;
let infoBoxRdcr;

// Reference:https://developers.google.com/maps/documentation/javascript/places#place_search_fields
/**
 * 搜尋特定地點
 * @param {String} name 
 * @param {Object} location 
 */
export const findPlace = (name, location) => {
	let request = {
		query: name,
		locationBias: location,
		fields: ['name', 'formatted_address', 'opening_hours', 'geometry', 'photo', 'business_status', 'icon', 'place_id', 'plus_code', 'price_level', 'rating', 'user_ratings_total'],
	};
	let service = new google.maps.places.PlacesService(googleMap);
	return new Promise((resolve, reject) => {
		service.findPlaceFromQuery(request, function (results, status) {
			if (status === google.maps.places.PlacesServiceStatus.OK) {
				resolve(results);
				// for (var i = 0; i < results.length; i++) {
				// 	createMarker(results[i]);
				// }
				// googleMap.setCenter(results[0].geometry.location);
			}
			reject([]);
		})
	});
}
/**
 * 建立地圖標記
 * @param {Object} result 
 */
export const createMarker = (result) => {
	let location = null;
	if (result.geometry && result.geometry.location) {
		location = result.geometry.location
	} else if (result && result.position) {
		location = result.position;
	}
	const request = {
		title: result.name,
		position: location,
		map: googleMap,
		icon: result.icon
	}
	const marker = new window.google.maps.Marker(request);
	let infowindow = null;
	marker.addListener('click', () => {
		console.log(marker);
		// BOUNCE EFFECT
		// (marker.getAnimation() == null) ?
		// 	marker.setAnimation(google.maps.Animation.BOUNCE)
		// 	: marker.setAnimation(null);

		(infowindow) ?
			infowindow.close()
			: infowindow = new google.maps.InfoWindow({
				content: marker.title
			});
		infowindow.open(googleMap, marker);
	});
	return marker;
}
/**
 * 搜尋當前地圖範圍的餐廳
 */
export const searchNearby = () => {
	const request = {
		// location: center,
		bounds: googleMap.getBounds(),
		// radius: '1500',
		keyword: ['餐廳', 'restaurant'],
		type: ['restaurant'],
		rankBy: google.maps.places.RankBy.PROMINENCE
	}
	clearMarkers();
	let service = new google.maps.places.PlacesService(googleMap);
	service.nearbySearch(request, (results, status) => {
		markers = [];
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
				results[i].icon = Icon.redDot;
				markers.push(createMarker(results[i]));;
			}
			// 若當前已經存在個人位置設定則將餐廳列表依距離作排列
			if (infoBoxRdcr.myLocation) {
				const distanceList = updateListWithDistance(infoBoxRdcr.myLocation, markers);
				dispatch(sortByDistance(distanceList));
			} else {
				dispatch(setMarksList(markers));
			}
		}
	});
}
/**
 * 計算兩地點的球面距離
 * @param {Object} p1 地點一
 * @param {Object} p2 地點二
 */
export const getDistance = (p1, p2) => {
	// https://stackoverflow.com/questions/1502590/calculate-distance-between-two-points-in-google-maps-v3
	const rad = function (x) {
		return x * Math.PI / 180;
	};
	const R = 6378137; // Earth’s mean radius in meter
	const dLat = rad(p2.lat() - p1.lat());
	const dLong = rad(p2.lng() - p1.lng());
	const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
		Math.sin(dLong / 2) * Math.sin(dLong / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const d = R * c;
	return d; // returns the distance in meter
}

let old_directionsRenderer = null;
/**
 * 繪製兩地點的路線圖
 * @param {Object} p1 地點一
 * @param {Object} p2 地點二
 */
export const routeRender = (p1, p2) => {
	cleanDirectionsRenderer();
	// 沒設定起點終點直接丟出
	if (!(p1 && p2)) return;
	const directionsService = new google.maps.DirectionsService();
	const directionsRenderer = new google.maps.DirectionsRenderer();
	// 清除地圖就路徑
	// 沒設定起點與終點
	old_directionsRenderer = directionsRenderer;
	const route = {
		origin: p1,
		destination: p2,
		travelMode: google.maps.TravelMode.DRIVING,
	}
	const calculateAndDisplayRoute = (directionsService, directionsRenderer) => {
		directionsService.route(
			route,
			(response, status) => {
				if (status === "OK") {
					directionsRenderer.setDirections(response);
				} else {
					window.alert("Directions request failed due to " + status);
				}
			}
		);
	}
	directionsRenderer.setMap(googleMap);
	calculateAndDisplayRoute(directionsService, directionsRenderer);
}

export const cleanDirectionsRenderer = () => {
	// 清除地圖就路徑
	if (old_directionsRenderer) old_directionsRenderer.setMap(null);
}

export const setMapOnAll = (map) => {
	for (let i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
	}
}
export const clearMarkers = () => {
	setMapOnAll(null);
}


// 地圖點擊事件
let myMarker = null;
const mapClickEvent = (e) => {
	// placeMarkerAndPanTo(e.latLng, map);
	if (myMarker) {
		myMarker.setMap(null)
	}
	myMarker = createMarker({
		name: 'I',
		position: e.latLng,
		icon: Icon.flag
	});
	dispatch(setMyLocation(e.latLng));
	// calculate stores' distance between own position
	const distanceList = updateListWithDistance(e.latLng, infoBoxRdcr.markList);
	dispatch(sortByDistance(distanceList));
	console.log(infoBoxRdcr);
}
/**
 * 計算當前位置與列表中店家的直線距離，並返回包含距離的列表
 * @param {Object} myLoc 我的位置
 * @param {Array<Object>} list nearbySearch 返回的列表
 * @return {Array}
 */
const updateListWithDistance = (myLoc, list) => {
	let distance;
	return list.map(item => {
		distance = getDistance(myLoc, item.position)
		item.distance = distance;
		return item;
	});
}
/**
 * 平移地圖到地點
 * @param {Object} location 
 */
export const panToLocation = (location) => {
	googleMap.panTo(location);
}

const Gmap = () => {
	dispatch = useDispatch();
	let state = useSelector(state => state);
	infoBoxRdcr = state.infoBoxRdcr;
	const gmapRef = useRef(null);
	const createGooogleMap = () => {
		return new window.google.maps.Map(gmapRef.current, {
			zoom: 14,
			center: {
				lat: 22.636220,
				lng: 120.344494
			}
		})
	}

	useEffect(() => {
		const googleMapScript = document.createElement('script');
		googleMapScript.src = URL;
		window.document.body.appendChild(googleMapScript);
		googleMapScript.addEventListener('load', () => {
			googleMap = createGooogleMap();
			let lazyLoad = null;
			googleMap.addListener('bounds_changed', () => {
				clearTimeout(lazyLoad);
				dispatch(setMarksListPadding());
				lazyLoad = setTimeout(() => searchNearby(googleMap.getCenter()), 500);
			});
			googleMap.addListener("click", (e) => mapClickEvent(e));
		});
	}, []);

	return (
		<div
			id="google-map"
			ref={gmapRef}
			style={{ height: '100vh', width: '100%' }}
		></div>
	)
}

export default Gmap;