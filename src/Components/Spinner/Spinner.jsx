import React from "react";

const Spinner = () => {
	let styles = {
		backgroundColor: "white",
		height: "100vh",
		opacity: 0.6,
	};
	return (
		<div style={styles} className="spinnerDiv">
			<svg className="spinner" viewBox="0 0 50 50">
				<circle
					className="path"
					cx="25"
					cy="25"
					r="20"
					fill="none"
					strokeWidth="5"
				></circle>
			</svg>
		</div>
	);
};

export default Spinner;
