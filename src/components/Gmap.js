// https://developers.google.com/maps/documentation/javascript/places#find_place_from_query
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setMarksList, setMyLocation, sortByDistance } from "../actions";
import { URL } from "./GmapAPI";
import Icon from "./Icon";

let googleMap = null;
let markers = [];
let dispatch = null;
let infoBoxRdcr, popBoxRdcr;

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
			dispatch(setMarksList(markers));
		}
	});
}

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

export const distanceCalculate = (p1, p2) => {
	var origin1 = new google.maps.LatLng(55.930385, -3.118425);
	var origin2 = 'Greenwich, England';
	var destinationA = 'Stockholm, Sweden';
	var destinationB = new google.maps.LatLng(50.087692, 14.421150);

	var service = new google.maps.DistanceMatrixService();
	service.getDistanceMatrix(
		{
			origins: [origin1, origin2],
			destinations: [destinationA, destinationB],
			travelMode: 'DRIVING',
			transitOptions: TransitOptions,
			drivingOptions: DrivingOptions,
			unitSystem: UnitSystem,
			avoidHighways: Boolean,
			avoidTolls: Boolean,
		}, callback);

	function callback(response, status) {
		if (status == 'OK') {
			var origins = response.originAddresses;
			var destinations = response.destinationAddresses;

			for (var i = 0; i < origins.length; i++) {
				var results = response.rows[i].elements;
				for (var j = 0; j < results.length; j++) {
					var element = results[j];
					var distance = element.distance.text;
					var duration = element.duration.text;
					var from = origins[i];
					var to = destinations[j];
				}
			}
		}
	}
}

let old_directionsRenderer = null;
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

const Gmap = () => {
	dispatch = useDispatch();
	let state = useSelector(state => state);
	infoBoxRdcr = state.infoBoxRdcr;
	popBoxRdcr = state.popBoxRdcr;
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
		let distance;
		const listWithDistance = infoBoxRdcr.markList.map(item => {
			distance = getDistance(e.latLng, item.position)
			item.distance = distance;
			return item;
		});
		dispatch(sortByDistance(listWithDistance));
		console.log(infoBoxRdcr);
	}

	useEffect(() => {
		const googleMapScript = document.createElement('script');
		googleMapScript.src = URL;
		window.document.body.appendChild(googleMapScript);
		googleMapScript.addEventListener('load', () => {
			googleMap = createGooogleMap();
			// marker = createMarker();
			let lazyLoad = null;
			googleMap.addListener('bounds_changed', () => {
				clearTimeout(lazyLoad);
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