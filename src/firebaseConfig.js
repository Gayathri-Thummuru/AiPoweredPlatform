// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyC5mLWls_DNEZ4kx9zmoOn_FgC5aBELSOg",
  authDomain: "aiplatform-5f3bd.firebaseapp.com",
  projectId: "aiplatform-5f3bd",
  storageBucket: "aiplatform-5f3bd.firebasestorage.app",
  messagingSenderId: "1029464925855",
  appId: "1:1029464925855:web:ae598a18da17f4438924aa",
  measurementId: "G-D18W09J5S9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Google Sign-In Function
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
  }
};

// Sign-Out Function
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign-Out Error:", error);
  }
};

// 🔹 Email/Password Sign-up
export const signUpUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await saveUserToFirestore(userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Sign-up Error:", error.message);
    return null;
  }
};

// 🔹 Email/Password Login
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Login Error:", error.message);
    return null;
  }
};

// 🔹 Save User to Firestore
const saveUserToFirestore = async (user) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "",
      createdAt: new Date(),
    });
  }
};



const db = getFirestore(app);
export { db };

export { auth };
export default app;
