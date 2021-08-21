import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
	TextField,
	Grid,
	Button,
	Paper,
	Card,
	CardContent,
	CardActions,
	Container,
	CardMedia,
	Typography,
	makeStyles,
} from "@material-ui/core";
import { AuthContext } from "../../Context/Authprovider";
import logo from "../../logo.jpg";

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
		marginBottom: "1rem",
	},

	alignCenter: {
		justifyContent: "center",
	},
});

toast.configure();
const Login = (props) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	let { login } = useContext(AuthContext);
	let classes = useStyles();

	const notifyError = (message) => {
		toast.error(message, { autoClose: 2000 });
	};

	const notifySuccess = (message) => {
		toast.success(message, { autoClose: 2000 });
	};
	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			handleLogin();
		}
	};

	const handleLogin = async () => {
		try {
			await login(email, password);
			props.history.push("/"); // navigate to feeds
			notifySuccess("Logged In successfully !");
		} catch (err) {
			setEmail("");
			setPassword("");
			notifyError(err.message);
		}
	};

	const handleSignUp = () => {
		props.history.push("/signup");
	};

	return (
		<div>
			<Container style={{ width: "400px" }}>
				<Grid
					container
					direction="column"
					alignItems="center"
					justify="center"
					style={{ minHeight: "80vh" }}
				>
					<Grid item className={classes.fullWidth}>
						{/* Login Form */}
						<Card variant="outlined" className={classes.mb}>
							<CardMedia
								image={logo}
								style={{ height: "8rem", backgroundSize: "contain" }}
							></CardMedia>

							<CardContent className={classes.centerElements}>
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
									onKeyPress={handleKeyPress}
								></TextField>
							</CardContent>
							<CardActions>
								<Button
									className={classes.fullWidth}
									variant="contained"
									color="primary"
									onClick={handleLogin}
								>
									Login
								</Button>
							</CardActions>
						</Card>
						<Card variant="outlined">
							<Typography style={{ textAlign: "center" }}>
								Don't have an account?
								<Button
									style={{ backgroundColor: "transparent" }}
									disableRipple
									color="primary"
									onClick={handleSignUp}
								>
									Sign Up
								</Button>
							</Typography>
						</Card>
					</Grid>
				</Grid>
			</Container>
		</div>
	);
};

export default Login;
