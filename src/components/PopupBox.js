import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import "./PopupBox.scss";



const PopupBox = () => {
	const dispatch = useDispatch();
	const { isShow, info } = useSelector(state => state.popBoxRdcr);
	return (isShow && info && typeof info === 'object') ?
		createTemplate(info)
		: null
}

const createTemplate = (info) => (
	<main className="popup-box">
		<section className="header card">
			<h1>{info.name}</h1>
		</section>
		<section className="container card">
			<div>
				<label>地址:</label>
				{info.formatted_address}
			</div>
			<div>
				<label>評價:</label>
				{info.rating}
			</div>
			<div>
				<label>圖片:</label>
				<ul>
					{
						info.photos.map((item, i) => {
							return (
								<li key={i}>
									<img src={item.getUrl()} alt="" />
								</li>
							)
						})
					}

				</ul>
			</div>
		</section>
	</main>
);

export default PopupBox;