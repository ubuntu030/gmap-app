import React, { useEffect, useRef } from "react";

const API_KEY = 'AIzaSyAFdiNp0eJahQ2lnlWnerbdQphFjPIAH_E';
const API_URL = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;

const Gmap = () => {
	const gmapRef = useRef(null);
	let googleMap = null;
	let marker = null;
	const createGooogleMap = () => {
		return new window.google.maps.Map(gmapRef.current, {
			zoom: 14,
			center: {
				lat: 22.636220,
				lng: 120.344494
			}
		})
	}
	const createMarker = () => {
		new window.google.maps.Marker({
			position: {
				lat: 22.637884,
				lng: 120.348509
			},
			map: googleMap
		})
	}
	useEffect(() => {
		const googleMapScript = document.createElement('script');
		googleMapScript.src = API_URL;
		window.document.body.appendChild(googleMapScript);
		googleMapScript.addEventListener('load', () => {
			googleMap = createGooogleMap();
			marker = createMarker();
			googleMap.addListener('bounds_changed', () => {
				// console.log(googleMap.getBounds());
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