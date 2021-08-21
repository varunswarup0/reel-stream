import React, { useState, useEffect } from "react";
import { firebaseAuth } from "../Config/firebase";

export const AuthContext = React.createContext();

export function AuthProvider({ children }) {
	const [currentUser, setUser] = useState(null);

	const login = (email, password) => {
		return firebaseAuth.signInWithEmailAndPassword(email, password);
	};

	const signOut = () => {
		return firebaseAuth.signOut();
	};

	const signUp = (email, password) => {
		return firebaseAuth.createUserWithEmailAndPassword(email, password);
	};

	useEffect(() => {
		firebaseAuth.onAuthStateChanged((user) => {
			setUser(user);
		});
	}, []);

	let value = {
		currentUser: currentUser,
		signOut: signOut,
		login: login,
		signUp: signUp,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
