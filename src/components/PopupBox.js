import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { isShowPopbox } from "../actions";

import "./PopupBox.scss";



const PopupBox = () => {
	const dispatch = useDispatch();
	const { isShow, info, loading } = useSelector(state => state.popBoxRdcr);
	const closeBox = () => {
		dispatch(isShowPopbox(false));
	}

	return (isShow && info && typeof info === 'object') ?
		<main className="popup-box">
			{(loading) ?
				<div className="loading-ctn">
					<div className="loading"></div>
				</div>
				: null}
			<section className="header card">
				<h1>{info.name}</h1>
				<img className="icon-close" onClick={() => closeBox()} src="src/public/icons8-macos-close-32.png" alt="close icon" />
			</section>
			<section className="container card">
				<div className="addrees">
					<label>地址:</label>
					{info.formatted_address}
				</div>
				<div className="score">
					<label>評價:</label>
					{info.rating}
				</div>
				<div className="img-ctn">
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
		: null
}

export default PopupBox;