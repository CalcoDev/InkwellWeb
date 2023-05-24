import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword as siweap,
    createUserWithEmailAndPassword,
    fetchSignInMethodsForEmail,
} from "firebase/auth";

const config = {
    apiKey: "AIzaSyCQgm6Ha6hW_FvU9PVx7enSIgh42Li9Uyo",
    authDomain: "inkwell-6fd82.firebaseapp.com",
    projectId: "inkwell-6fd82",
    storageBucket: "inkwell-6fd82.appspot.com",
    messagingSenderId: "696275361314",
    appId: "1:696275361314:web:ff155c9a6add967364f47b",
    measurementId: "G-X74K3KNJ1Q",
};
const app = initializeApp(config);

// Auth
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    prompt: "select_account",
});

export const signInWithGoogle = async () => {
    try {
        const { user } = await signInWithPopup(auth, provider);

        // TODO(calco): Warn the user that signing in with google will migrate all data to google account.

        const userData = await addUserToDatabase(user, {
            photoURL: user.photoURL || `https://robohash.org/${user.uid}.png`,
        });

        return { succeded: true, user: userData };
    } catch (error) {
        return {
            succeded: false,
            errorCode: "Error signing in with Google. Please try again!",
        };
    }
};

export const signInWithEmailAndPassword = async (email, password) => {
    try {
        const li = await fetchSignInMethodsForEmail(auth, email);
        if (!li.includes("password") && li.length > 0)
            return {
                succeded: false,
                errorCode:
                    "Email already in use, maybe in the form of another provider.",
            };

        const { user } = await siweap(auth, email, password);

        try {
            const userData = (
                await getDoc(doc(db, `users/${user.uid}`))
            ).data();
            return {
                succeded: true,
                user: userData,
            };
        } catch (error) {
            return {
                succeded: false,
                errorCode:
                    "Error reading user data from database. Please try again!",
            };
        }
    } catch (error) {
        return {
            succeded: false,
            errorCode: error.message,
        };
    }
};

export const signUpWithEmailAndPassword = async (
    email,
    password,
    additionalParams
) => {
    try {
        const li = await fetchSignInMethodsForEmail(auth, email);
        if (li.length > 0)
            return {
                succeded: false,
                errorCode:
                    "Email already in use, maybe in the form of another provider.",
            };

        const { user } = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const userData = await addUserToDatabase(user, {
            photoURL: `https://robohash.org/${user.uid}.png`,
            ...additionalParams,
        });

        return { succeded: true, user: userData };
    } catch (error) {
        return {
            succeded: false,
            errorCode: error.message,
        };
    }
};

// Firestore DB
const db = getFirestore(app);

const addUserToDatabase = async (authObject, otherProps) => {
    // This will fire on sign out as well:
    if (!authObject) return;

    // Get the user ref and check if it is empty
    const userRef = doc(db, `users/${authObject.uid}`);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
        // Create a new object with all of the info we want:
        const { displayName, email } = authObject;
        const createdAt = new Date();

        // Add user to database:
        try {
            setDoc(userRef, {
                displayName: displayName || email.split("@")[0],
                email,
                createdAt,
                ...otherProps,
            });
        } catch (error) {
            throw "Error adding user to the database. Please try again!";
        }
    } else {
        console.log("User already exists in the database.");
    }

    return (await getDoc(userRef)).data();
};
