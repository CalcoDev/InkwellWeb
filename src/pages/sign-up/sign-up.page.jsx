import { useEffect, useState } from "react";
import SignPageContainer from "../../components/sign-page-container/sign-page-container.component";
import InkInput from "../../components/ink-input/ink-input.component";
import InkButton from "../../components/ink-button/ink-button.component";
import { Link, useNavigate } from "react-router-dom";
import {
    signInWithGoogle,
    signUpWithEmailAndPassword,
} from "../../firebase/firebase.utility";
import { useRecoilState } from "recoil";
import userState from "../../recoil/atoms/user-state.atom";

const SignUp = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");

    const [errorCode, setErrorCode] = useState(null);
    const [signedIn, setSignedIn] = useState(false);
    const [_, setGlobalUserState] = useRecoilState(userState);
    const navigate = useNavigate();

    // TODO(calco): Error handling on page, especially passworda!
    const handleSubmit = async () => {
        if (password !== verifyPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const { succeded, errorCode, user } =
                await signUpWithEmailAndPassword(email, password, {
                    displayName: username,
                });
            setErrorCode(succeded ? null : errorCode);

            setSignedIn(user || false);
        } catch (error) {
            setErrorCode(error.code);
        }

        setUsername("");
        setEmail("");
        setPassword("");
        setVerifyPassword("");
    };

    const handleSignInWithGoogle = async () => {
        try {
            const { succeded, errorCode, user } = await signInWithGoogle();
            setErrorCode(succeded ? null : errorCode);

            setSignedIn(user || false);
        } catch (error) {
            setErrorCode(error.code);
        }
    };

    useEffect(() => {
        if (signedIn) {
            setGlobalUserState(signedIn);
            navigate("/projects");
        }
    }, [signedIn, navigate]);

    return (
        <SignPageContainer>
            <InkInput
                className="mb-8"
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <InkInput
                className="mb-8"
                label="Email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <InkInput
                className="mb-8"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <InkInput
                className={errorCode !== null && "mb-8"}
                label="Verify Password"
                type="password"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
            />

            {errorCode !== null && (
                <div className="text-ink-red text-xs text-center">
                    ERROR OCCURED: {errorCode}
                </div>
            )}

            <div
                className={`flex justify-between ${
                    errorCode !== null ? "mt-8" : "mt-16"
                }`}
            >
                <div className="flex flex-col">
                    <InkButton onClick={handleSubmit}>SIGN UP</InkButton>
                    <div className="relative">
                        <Link
                            className="absolute font-ink-fira text-ink-light-grey text-xxs hover:underline w-full text-center mt-2"
                            to="/sign-in"
                        >
                            Already have an account?
                        </Link>
                    </div>
                </div>
                <InkButton onClick={handleSignInWithGoogle}>
                    <img
                        src="/icons/google_sign_in.svg"
                        alt="Sign in with Google"
                    />
                </InkButton>
            </div>
        </SignPageContainer>
    );
};

export default SignUp;
