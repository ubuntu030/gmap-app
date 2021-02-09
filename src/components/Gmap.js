import React, { useState, useEffect, useRef } from "react";
import { GoogleMap } from "react-google-maps";
import { URL } from "./GmapAPI";

const Gmap = () => {
	const gmapRef = useRef(null);
	let googleMap = null;
	const createGooogleMap = () => {
		return new window.google.maps.Map(gmapRef.current, {
			zoom: 14,
			center: {
				lat: 22.636220,
				lng: 120.344494
			}
		})
	}
	let markers = [];
	const createMarker = (result) => {
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
	// Reference:https://developers.google.com/maps/documentation/javascript/places#place_search_fields
	const findPlace = (name = '高雄長庚紀念醫院') => {
		let request = {
			query: name,
			fields: ['name', 'formatted_address', 'opening_hours', 'geometry', 'photo', 'business_status', 'icon', 'place_id', 'plus_code', 'price_level', 'rating', 'user_ratings_total'],
		};
		let service = new google.maps.places.PlacesService(googleMap);
		service.findPlaceFromQuery(request, function (results, status) {
			if (status === google.maps.places.PlacesServiceStatus.OK) {
				for (var i = 0; i < results.length; i++) {
					createMarker(results[i]);
				}
				// googleMap.setCenter(results[0].geometry.location);
			}
		});
	}

	const searchNearby = (center) => {
		const request = {
			location: center,
			radius: '1500',
			type: ['restaurant']
		}
		clearMarkers();
		let service = new google.maps.places.PlacesService(googleMap);
		service.nearbySearch(request, (results, status) => {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				for (var i = 0; i < results.length; i++) {
					markers.push(createMarker(results[i]));;
				}
			}
		});
	}

	const searchWithText = (center) => {
		const request = {
			location: new google.maps.LatLng(22.648238, 120.347376),
			radius: '500',
			// bounds: googleMap.getBounds(),
			query: 'restaurant',
			// type: ['restaurant']
		}
		let service = new google.maps.places.PlacesService(GoogleMap);
		service.textSearch(request, (results, status) => {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				for (var i = 0; i < results.length; i++) {
					var place = results[i];
					createMarker(results[i]);
				}
			}
		});
	};

	const setMapOnAll = (map) => {
		for (let i = 0; i < markers.length; i++) {
			markers[i].setMap(map);
		}
	}
	const clearMarkers = () => {
		setMapOnAll(null);
	}

	useEffect(() => {
		const googleMapScript = document.createElement('script');
		googleMapScript.src = URL;
		window.document.body.appendChild(googleMapScript);
		googleMapScript.addEventListener('load', () => {
			googleMap = createGooogleMap();
			// marker = createMarker();
			googleMap.addListener('bounds_changed', () => {
				searchNearby(googleMap.getCenter());
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