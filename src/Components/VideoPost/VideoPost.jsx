import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Fab, makeStyles, Button } from "@material-ui/core";
import { Favorite } from "@material-ui/icons";

import FavUnfilled from "@material-ui/icons/FavoriteBorder";
import { firebaseDB } from "../../Config/firebase";
import { AuthContext } from "../../Context/Authprovider";
import "./VideoPost.css";
import { useContext } from "react";

let useStyles = makeStyles({
	fab: {
		position: "absolute",
		zIndex: 2,
		color: "red",
		cursor: "pointer",
		backgroundColor: "transparent",
		bottom: "112px",
		right: "20px",
		transform: "scale(0.8)",
	},
	pad: {
		padding: "10px",
		fontWeight: "bold",
	},

	likesCount: {
		position: "absolute",
		zIndex: 2,
		color: "white !important",
		bottom: "75px",
		right: "15px",
		fontWeight: "bold",
	},
});

const VideoPost = ({uid, postObj }) => {
	let classes = useStyles();
	let { currentUser } = useContext(AuthContext);
	const [userObject, setUserObject] = useState({});
	const [likesCount, setLikesCount] = useState(null);
	const [isLiked, setIsLiked] = useState(false);

	useEffect(() => {
		firebaseDB
			.collection("users")
			.doc(uid)
			.get()
			.then((doc) => {
				return doc.data();
			})
			.then((userObj) => {
				setUserObject(userObj);
			});
	});

	//  get count of likes of a post and set to state
	useEffect(() => {
		let likes = postObj.likes;
		if (likes.includes(currentUser.uid)) {
			setIsLiked(true);
			setLikesCount(likes.length);
		} else {
			if (likes.length) {
				setLikesCount(likes.length);
			}
		}
	});

	const toggleLikeIcon = async () => {
		if (isLiked) {
			let postDoc = postObj;
			let filteredLikes = postDoc.likes.filter((uid) => {
				if (uid === currentUser.uid) {
					return false;
				} else {
					return true;
				}
			});

			postDoc.likes = filteredLikes;
			await firebaseDB.collection("posts").doc(postDoc.pid).set(postDoc);
			setIsLiked(false);
			likesCount === 1 ? setLikesCount(null) : setLikesCount(likesCount - 1);
		} else {
			let postDoc = postObj;
			postDoc.likes.push(currentUser.uid);
			await firebaseDB.collection("posts").doc(postDoc.pid).set(postDoc);
			setIsLiked(true);
			likesCount == null ? setLikesCount(1) : setLikesCount(likesCount + 1);
		}
	};
	return (
		<div className="video-container">
			{isLiked ? (
				<Fab
					className={classes.fab}
					aria-label="like"
					onClick={() => toggleLikeIcon()}
				>
					<Favorite fontSize="large" />
				</Fab>
			) : (
				<Fab
					className={classes.fab}
					aria-label="like"
					onClick={() => toggleLikeIcon()}
				>
					<FavUnfilled fontSize="large" />
				</Fab>
			)}
			<Button className={classes.likesCount} aria-label="like" disabled>
				{likesCount}
			</Button>
			<Video
				pid={postObj.pid}
				url={userObject.profileImageUrl}
				name={userObject.username}
				src={postObj.videoLink}
				date={
					postObj.createdAt !== null
						? JSON.stringify(postObj.createdAt.toDate()).slice(1, 11)
						: ""
				}
				likesCount={likesCount}
			></Video>
		</div>
	);
};

const Video = ({ pid, url, name, src, date, likesCount }) => {
	let classes = useStyles();
	let styles = {
		height: "76vh",
	};

	const handleMute = (e) => {
		e.preventDefault();
		e.target.muted = !e.target.muted;
	};

	return (
		<div className="video-post">
			<Link to="/" className="link">
				<div className="header">
					<div className="avatar">
						<Avatar src={url}></Avatar>
					</div>
					<div className="info">
						<p className="name">{name}</p>
						<p className="post-date">{date}</p>
					</div>
				</div>
			</Link>
			<div id="video">
				<video
					id={pid}
					style={styles}
					muted={true}
					loop={true}
					onClick={(e) => handleMute(e)}
				>
					<source src={src} type="video/mp4" />
				</video>
			</div>
		</div>
	);
};
export default VideoPost;
