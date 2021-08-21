import { React, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, makeStyles,  Avatar } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import { AuthContext } from "../../Context/Authprovider";
import { firebaseDB } from "../../Config/firebase";
import Upload from "../../Components/Upload/Upload";
import logo from "../../logo.jpg";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import "./Header.css";

const useStyles = makeStyles((theme) => ({
	grow: {
		flexGrow: 1,
	},
	black: {
		color: "black",
	},
	small: {
		transform: "scale(0.8)",
	},
	medium: {
		width: theme.spacing(3),
		height: theme.spacing(3),
	},
	large: {
		width: theme.spacing(4),
		height: theme.spacing(4),
	},
	white: {
		backgroundColor: "white",
	},
}));

toast.configure();
const Header = () => {
	const { signOut, currentUser } = useContext(AuthContext);
	const [userObj, setUserObj] = useState([]);
	let uid = currentUser.uid;

	useEffect(() => {
		const loadUser = () => {
			firebaseDB
				.collection("users")
				.doc(uid)
				.get()
				.then((doc) => {
					return doc.data();
				})
				.then((userObject) => {
					setUserObj(userObject);
				});
		};
		loadUser();
	}, [uid]);

	let classes = useStyles();
	const ShowProfile = ({ isLoggedIn }) => {
		if (isLoggedIn) {
			return (
				<div className="header">
					<div className="avatar">
						<Link to="/profile" className={classes.black}>
							<Avatar
								src={userObj.profileImageUrl}
								className={classes.small}
							></Avatar>
						</Link>
					</div>
				</div>
			);
		} else {
			return null;
		}
	};

	const ShowHome = ({ isLoggedIn }) => {
		if (isLoggedIn) {
			return (
				<Link to="/" className={classes.black}>
					<HomeIcon className={classes.medium}></HomeIcon>
				</Link>
			);
		} else {
			return null;
		}
	};

	const ShowLogout = ({ isLoggedIn, handleLogout }) => {
		if (isLoggedIn) {
			return (
				<ExitToAppIcon
					onClick={handleLogout}
					color="primary"
					className={`${classes.large} ${classes.black}`}
					style={{ cursor: "pointer" }}
				>
					Logout
				</ExitToAppIcon>
			);
		} else {
			return null;
		}
	};

	const ShowBanner = () => {
		return (
			<Link to="/" className={classes.black}>
				<div className="banner">
					<img src={logo} alt="Banner"></img>
				</div>
			</Link>
		);
	};

	const handle_Logout = async (props) => {
		try {
			await signOut();
			toast.success("Logged Out successfully !", { autoClose: 2000 });
			props.history.push("/login");
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<AppBar id="header" position="sticky" className={classes.white}>
			<Toolbar>
				{currentUser != null ? (
					<div className="upload-Video">
						<label>
							<Upload></Upload>
						</label>
					</div>
				) : null}
				<ShowBanner></ShowBanner>
				<div className={classes.grow} />
				<ShowHome isLoggedIn={currentUser}></ShowHome>
				<ShowProfile isLoggedIn={currentUser}></ShowProfile>
				<ShowLogout
					isLoggedIn={currentUser}
					handleLogout={handle_Logout}
				></ShowLogout>
			</Toolbar>
		</AppBar>
	);
};

export default Header;
