import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setGuiding } from "../actions";

import "./Guide.scss";


const Guide = () => {
	const guideImgList = [
		{ des: '請先點選地圖，設定自己所在位置', name: 'guide_1.png' },
		{ des: '出現標旗後，會與附近店家做距離由近到遠的排列', name: 'guide_2.png' },
		{ des: '按下導航繪出路徑', name: 'guide_3.png' },

	]
	const dispatch = useDispatch();
	const [curtImg, setCurtImg] = useState(guideImgList[0]);
	const { isGuiding } = useSelector(state => state.infoBoxRdcr);
	return (
		<>
			{
				isGuiding ?
					<main className="guid-container" >
						<div className="des-ctn">
							{curtImg.des}
						</div>
						<div className="img-ctn">
							<img className="display-img" src={`src/public/guide/${curtImg.name}`} />
							<ul className="slide-list">
								{
									guideImgList.map(item => {
										return <li key={item.name} onClick={() => setCurtImg(item)}><img src={`src/public/guide/${item.name}`} /></li>
									})
								}
							</ul>
						</div>
						<div className="ctrl-ctn">
							<button onClick={() => { dispatch(setGuiding(false)) }}>關閉</button>
						</div>
					</main> : null
			}
		</>
	)
}

export default Guide;