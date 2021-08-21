import { React, useState, useContext } from "react";
import {
	Button,
	List,
	ListItem,
	DialogTitle,
	Dialog,
	LinearProgress,
	Fab,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import { AuthContext } from "../../Context/Authprovider";
import { firebaseDB, firebaseStorage, timeStamp } from "../../Config/firebase";
import { uuid } from "uuidv4";

const useStyles = makeStyles(() => ({
	fabButton: {
		position: "absolute",
		zIndex: 1,
		left: 0,
		right: 0,
		margin: "0 auto",
	},
}));

function SimpleDialog({ open, onClose }) {
	const [videoFile, setVideoFile] = useState(null);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [uploadClicked, setUploadClicked] = useState(false);
	const [uploadVideoError, setUploadVideoError] = useState("");
	const { currentUser } = useContext(AuthContext);

	const handleClose = () => {
		onClose("");
	};

	const handleInputFile = (e) => {
		let file = e.target.files[0];
		setVideoFile(file);
	};

	const uploadFile = async () => {
		try {
			if (videoFile.size / 1000000 > 25) {
				setUploadVideoError("Selected file exceeds 25MB cannot upload");
				return;
			}

			if (videoFile == null) {
				console.log("No video selected !");
				return;
			}

			let uid = currentUser.uid;
			const uploadVideoObject = firebaseStorage
				.ref(`/profilePhotos/${uid}/${Date.now()}.mp4`)
				.put(videoFile);

			uploadVideoObject.on("state_changed", fun1, fun2, fun3);

			function fun1(snapshot) {
				setUploadClicked(true);
				let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setUploadProgress(progress);
				console.log(progress);
			}

			function fun2(error) {
				console.log(error);
			}

			async function fun3() {
				setUploadClicked(false);
				setUploadVideoError("");
				let videoURL = await uploadVideoObject.snapshot.ref.getDownloadURL();
				let pid = uuid();
				await firebaseDB.collection("posts").doc(pid).set({
					pid: pid,
					uid: uid,
					comments: [],
					likes: [],
					videoLink: videoURL,
					createdAt: timeStamp(),
				});
				let doc = await firebaseDB.collection("users").doc(uid).get();
				let document = doc.data();
				document.postsCreated.push(pid);
				await firebaseDB.collection("users").doc(uid).set(document);
				onClose("");
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Dialog
			onClose={handleClose}
			aria-labelledby="simple-dialog-title"
			open={open}
		>
			<DialogTitle id="simple-dialog-title">
				Select a file to upload
			</DialogTitle>
			<List>
				<ListItem>
					<input type="file" onChange={handleInputFile} />
					<Button variant="contained" color="primary" onClick={uploadFile}>
						Upload
					</Button>
				</ListItem>
				<ShowUploadProgress
					progress={uploadProgress}
					isUploading={uploadClicked}
				></ShowUploadProgress>
				<p>{uploadVideoError}</p>
			</List>
		</Dialog>
	);
}

const Upload = () => {
	const classes = useStyles();

	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<Fab
				color="primary"
				aria-label="add"
				className={classes.fabButton}
				onClick={handleClickOpen}
			>
				<AddIcon />
			</Fab>
			<SimpleDialog open={open} onClose={handleClose} />
		</div>
	);
};

const ShowUploadProgress = ({ progress, isUploading }) => {
	if (isUploading === true) {
		return (
			<LinearProgress variant="determinate" value={progress}></LinearProgress>
		);
	} else {
		return null;
	}
};

export default Upload;
