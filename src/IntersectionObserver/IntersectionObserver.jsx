import React, { useEffect } from "react";
import video1 from "./v1.mp4";
import video2 from "./v2.mp4";
import video3 from "./v3.mp4";
import video4 from "./v4.mp4";
import "./IntersectionObserver.css";

const IntersectionDemo = () => {
	function callback(entries) {
		entries.forEach((entry) => {
			let child = entry.target.children[0];

			child.play().then(function () {
				if (entry.isIntersecting === false) {
					child.pause();
				}
			});
		});
	}

	let conditionObject = {
		root: null,
		threshold: 0.8,
	};

	useEffect(() => {
		let observerObject = new IntersectionObserver(callback, conditionObject);
		let elements = document.querySelectorAll(".video-container");

		elements.forEach((e1) => {
			observerObject.observe(e1);
		});
	}, []);

	return (
		<div>
			<div className="video-container">
				<Video src={video1} id="a"></Video>
			</div>
			<div className="video-container">
				<Video src={video2} id="b"></Video>
			</div>
			<div className="video-container">
				<Video src={video3} id="c"></Video>
			</div>
			<div className="video-container">
				<Video src={video4} id="d"></Video>
			</div>
		</div>
	);
};

const Video = ({ src, id }) => {
	return (
		<video className="video-styles" controls muted="true" id={id}>
			<source src={src} type="video/mp4"></source>
		</video>
	);
};

export default IntersectionDemo;
