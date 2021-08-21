import React, { useState, useEffect } from "react";
import VideoPost from "../VideoPost/VideoPost";
import Header from "../Header/Header";
import { firebaseDB } from "../../Config/firebase";
import CircularProgress from "@material-ui/core/CircularProgress";

import "./Feeds.css";

const Feeds = () => {
	const [loadingComp, setLoadingComps] = useState(true);
	const [posts, setPosts] = useState([]);

	/*Intersection Observer config*/
	useEffect(() => {
		let conditionObject = {
			root: null,
			threshold: 0.8,
		};

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

		let observerObject = new IntersectionObserver(callback, conditionObject);
		let elements = document.querySelectorAll(".video-container #video");

		elements.forEach((e1) => {
			observerObject.observe(e1);
		});

		return function cleanup() {
			observerObject.disconnect();
		};
	});

	/*Load all posts object from firebase and set state
	Refresh posts when firebase has new updates*/
	useEffect(() => {
		firebaseDB
			.collection("posts")
			.orderBy("createdAt", "desc")
			.onSnapshot((snapshot) => {
				let allPosts = snapshot.docs.map((doc) => {
					return doc.data();
				});
				setPosts(allPosts);
				setLoadingComps(false);
			});

		return function cleanup() {
			setPosts([]);
		};
	}, []);

	return (
		<>
			<Header></Header>
			<div className="feeds">
				{loadingComp ? (
					<CircularProgress
						variant="indeterminate"
						id="circular-loading"
					></CircularProgress>
				) : (
					<div className="feeds-video-list">
						{posts.map((postObj) => {
							return (
								<div className="video">
									<VideoPost
										key={postObj.pid}
										uid={postObj.uid}
										postObj={postObj}
									></VideoPost>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</>
	);
};

export default Feeds;
