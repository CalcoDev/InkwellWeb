import { useState } from "react";
import InkInput from "../../components/ink-input/ink-input.component";
import InkButton from "../../components/ink-button/ink-button.component";
import SignPageContainer from "../../components/sign-page-container/sign-page-container.component";
import { useRecoilState } from "recoil";
import { Link } from "react-router-dom";
import {
    signInWithEmailAndPassword,
    signInWithGoogle,
} from "../../firebase/firebase.utility";
import userState from "../../recoil/atoms/user-state.atom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errorCode, setErrorCode] = useState(null);
    const [signedIn, setSignedIn] = useState(false);
    const [_, setGlobalUserState] = useRecoilState(userState);
    const navigate = useNavigate();

    const handleSignInWithEmailAndPassword = async () => {
        try {
            const { succeded, errorCode, user } =
                await signInWithEmailAndPassword(email, password);
            setErrorCode(succeded ? null : errorCode);

            setSignedIn(user || false);
        } catch (error) {
            setErrorCode(error.code);
        }

        setEmail("");
        setPassword("");
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
            console.log({
                connected: true,
                ...signedIn,
            });

            setGlobalUserState({
                connected: true,
                ...signedIn,
            });
            navigate("/projects");
        }
    }, [signedIn, navigate]);

    return (
        <SignPageContainer>
            <InkInput
                className="mb-8"
                label="Email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                lightTheme={true}
            />
            <InkInput
                className={errorCode !== null && "mb-8"}
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                lightTheme={true}
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
                <div>
                    <InkButton onClick={handleSignInWithEmailAndPassword}>
                        SIGN IN
                    </InkButton>
                    <div className="relative">
                        <Link
                            className="absolute font-ink-fira text-ink-light-grey text-xxs hover:underline w-full text-center mt-2"
                            to="/sign-up"
                        >
                            No account?
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

export default SignIn;
