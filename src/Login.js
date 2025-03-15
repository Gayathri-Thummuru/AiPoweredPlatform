import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { signInWithGoogle, logOut, signUpUser, loginUser } from "./firebaseConfig"; // Import the functions
import { getFirestore, doc, setDoc } from "firebase/firestore";
import app from "./firebaseConfig";
import "./Login.css";

const auth = getAuth(app);
const db = getFirestore(app);

const Login = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Function to store user in Firestore
  const saveUserToFirestore = async (user) => {
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        createdAt: new Date(),
      });
      console.log("User saved in Firestore");
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  // Handle Email/Password Authentication
  const handleAuth = async () => {
    setErrorMessage("");
    let result;

    if (isSignUp) {
      result = await signUpUser(email, password);
    } else {
      result = await loginUser(email, password);
    }

    if (result.error) {
      if (result.error.includes("user-not-found")) {
        setErrorMessage("No account found with this email.");
      } else if (result.error.includes("wrong-password")) {
        setErrorMessage("Incorrect password.");
      } else if (result.error.includes("invalid-email")) {
        setErrorMessage("Invalid email format.");
      } else if (result.error.includes("email-already-in-use")) {
        setErrorMessage("This email is already registered.");
      } else {
        setErrorMessage(result.error);
      }
    } else {
      setUser(result.user);
    }
  };

  // Google Sign-In
  const handleGoogleLogin = async () => {
    const loggedInUser = await signInWithGoogle();
    setUser(loggedInUser);
    await saveUserToFirestore(loggedInUser);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-semibold mb-4">{isSignUp ? "Sign Up" : "Login"}</h1>

        {user ? (
          <div>
            <p className="mb-2">Welcome, {user.displayName || user.email}</p>
            {user.photoURL && <img src={user.photoURL} alt="Profile" className="rounded-full w-16 h-16 mx-auto mb-2" />}
            <button
              onClick={() => {
                logOut();
                setUser(null);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded mt-2"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            {/* Email & Password Authentication */}
            <input
              type="email"
              placeholder="Enter your email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter your password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="login-button" onClick={handleAuth}>
              {isSignUp ? "Sign Up" : "Login"}
            </button>
            {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

            {/* OR Divider */}
            <div className="or-divider">
              <span>OR</span>
            </div>

            {/* Google Sign-In */}
            <button onClick={handleGoogleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
              Sign In with Google
            </button>

            {/* Toggle Sign-Up / Login */}
            <p className="toggle-text" onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? "Already have an account? Login" : "New user? Sign Up"}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;