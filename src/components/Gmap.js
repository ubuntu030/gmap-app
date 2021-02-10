import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import { setMarksList } from "../actions";
import { URL } from "./GmapAPI";

let googleMap = null;
let markers = [];
let dispatch = null;

// Reference:https://developers.google.com/maps/documentation/javascript/places#place_search_fields
export const findPlace = (name, location) => {
	let request = {
		query: name,
		fields: ['name', 'formatted_address', 'opening_hours', 'geometry', 'photo', 'business_status', 'icon', 'place_id', 'plus_code', 'price_level', 'rating', 'user_ratings_total'],
	};
	let service = new google.maps.places.PlacesService(googleMap);
	return new Promise((resolve, reject) => {
		service.findPlaceFromQuery(request, function (results, status) {
			if (status === google.maps.places.PlacesServiceStatus.OK) {
				return resolve(results);
				// for (var i = 0; i < results.length; i++) {
				// 	createMarker(results[i]);
				// }
				// googleMap.setCenter(results[0].geometry.location);
			}
			reject([]);
		})
	});
}

export const createMarker = (result) => {
	const marker = new window.google.maps.Marker({
		title: result.name,
		position: result.geometry.location,
		map: googleMap,
		// icon:result.icon
	});

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

export const searchNearby = (center) => {
	const request = {
		// location: center,
		bounds: googleMap.getBounds(),
		radius: '1500',
		keyword: ['餐廳', 'restaurant'],
		type: ['restaurant']
		// rankBy: google.maps.places.RankBy.DISTANCE
	}
	clearMarkers();
	let service = new google.maps.places.PlacesService(googleMap);
	service.nearbySearch(request, (results, status) => {
		let markers = [];
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
				markers.push(createMarker(results[i]));;
			}
			dispatch(setMarksList(markers));
		}
	});
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
			// marker = createMarker();
			let lazyLoad = null;
			googleMap.addListener('bounds_changed', () => {
				clearTimeout(lazyLoad);
				lazyLoad = setTimeout(() => searchNearby(googleMap.getCenter()), 500);
				// console.log(googleMap.getBounds());
				// findPlace();
			});
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