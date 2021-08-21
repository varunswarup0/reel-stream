import React, { useContext, useState, useRef } from "react";
import { firebaseDB, firebaseStorage } from "../../Config/firebase";
import { AuthContext } from "../../Context/Authprovider";
import {
	Button,
	Container,
	Grid,
	Card,
	CardMedia,
	TextField,
	CardContent,
	CardActions,
	Typography,
	makeStyles,
} from "@material-ui/core";
import logo from "../../logo.jpg";
import { toast } from "react-toastify";
import { PhotoCamera as CameraIcon } from "@material-ui/icons";

let useStyles = makeStyles({
	root: {
		width: "100%",
		height: "100%",
	},
	centerDiv: {
		height: "100vh",
		display: "flex",
		justifyContent: "center",
		width: "100vw",
	},
	carousal: {
		height: "10rem",
		backgroundColor: "whitesmoke",
	},

	fullWidth: {
		width: "100%",
	},

	centerElements: {
		display: "flex",
		flexDirection: "column",
	},

	mb: {
		marginBottom: "0.8rem",
	},

	alignCenter: {
		justifyContent: "center",
	},
});

toast.configure();
const Signup = (props) => {
	let classes = useStyles();
	const fileRef = useRef();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [profileImage, setProfileImage] = useState(null);
	const [loading, setLoading] = useState(false);
	const { signUp } = useContext(AuthContext);

	const handleFileSubmit = (event) => {
		let fileObject = event.target.files[0];
		setProfileImage(fileObject);
		console.log(fileObject);
	};

	const handleSignUp = async () => {
		if (username === "" || email === "" || password === "") {
			toast.warning("All fields are mandatory to fill.", { autoClose: 2000 });
			return;
		} else if (profileImage === null) {
			toast.warning("Please choose a profile picture.", { autoClose: 2000 });
			return;
		}
		try {
			let response = await signUp(email, password);
			let uid = response.user.uid;
			const uploadPhotoObject = firebaseStorage
				.ref(`/profilePhotos/${uid}/image.jpg`)
				.put(profileImage);
			uploadPhotoObject.on("state_changed", fun1, fun2, fun3);

			function fun1(snapshot) {
				setLoading(true);
				let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log(progress);
			}

			function fun2(error) {
				toast.error(error, { autoClose: 2000 });
			}

			async function fun3() {
				let profileImageUrl =
					await uploadPhotoObject.snapshot.ref.getDownloadURL();
				firebaseDB.collection("users").doc(uid).set({
					email: email,
					userId: uid,
					username: username,
					profileImageUrl: profileImageUrl,
					postsCreated: [],
				});
				props.history.push("/");
				toast.success("Signed Up successfully.", { autoClose: 2000 });
			}
		} catch (err) {
			setLoading(false);
			toast.error(err.message, username === null);
		}
	};

	const handleProfileUpload = () => {
		fileRef.current.click();
	};

	const handleLogin = () => {
		props.history.push("/login");
	};

	return (
		<Container style={{width: "400px"}}>
			<Grid
				container
				direction="column"
				alignItems="center"
				justify="center"
				style={{ minHeight: "80vh" }}
			>
				<Grid item className={classes.fullWidth}>
					{/* Signup Form */}
					<Card variant="outlined" className={classes.mb}>
						<CardMedia
							image={logo}
							style={{ height: "8rem", backgroundSize: "contain" }}
						></CardMedia>
						<CardContent className={classes.centerElements}>
							<TextField
								className={classes.mb}
								label="Username"
								type="text"
								variant="outlined"
								value={username}
								size="small"
								onChange={(e) => setUsername(e.target.value)}
							></TextField>
							<TextField
								className={classes.mb}
								label="Email"
								type="email"
								variant="outlined"
								value={email}
								size="small"
								onChange={(e) => setEmail(e.target.value)}
							></TextField>
							<TextField
								label="Password"
								type="password"
								variant="outlined"
								value={password}
								size="small"
								onChange={(e) => setPassword(e.target.value)}
							></TextField>
						</CardContent>
						<input
							ref={fileRef}
							type="file"
							accept="image/*"
							onChange={(e) => {
								handleFileSubmit(e);
							}}
							hidden
						></input>
						<CardActions className={classes.centerElements}>
							<Button
								variant="outlined"
								color="secondary"
								className={classes.fullWidth}
								fullWidth={true}
								startIcon={<CameraIcon></CameraIcon>}
								onClick={handleProfileUpload}
							>
								Upload
							</Button>
						</CardActions>
						<CardActions className={classes.centerElements}>
							<Button
								disabled={loading}
								className={classes.fullWidth}
								variant="contained"
								color="primary"
								onClick={handleSignUp}
							>
								Sign Up
							</Button>
						</CardActions>
					</Card>
					<Card variant="outlined">
						<Typography style={{ textAlign: "center" }}>
							Already have an account?
							<Button
								style={{ backgroundColor: "transparent" }}
								disableRipple
								color="primary"
								onClick={handleLogin}
							>
								Login
							</Button>
						</Typography>
					</Card>
				</Grid>
			</Grid>
		</Container>
	);
};

export default Signup;
