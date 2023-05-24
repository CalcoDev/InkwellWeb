import { useState } from "react";
import InkInput from "../../components/ink-input/ink-input.component";
import InkButton from "../../components/ink-button/ink-button.component";
import SignPageContainer from "../../components/sign-page-container/sign-page-container.component";
import { Link } from "react-router-dom";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <SignPageContainer>
            <InkInput
                className="mb-8"
                label="Email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <InkInput
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex justify-between mt-16">
                <div className="flex flex-col">
                    <InkButton>SIGN IN</InkButton>
                    <div className="relative">
                        <Link
                            className="absolute font-ink-fira text-ink-light-grey text-xxs hover:underline w-full text-center mt-2"
                            to="/sign-up"
                        >
                            No account?
                        </Link>
                    </div>
                </div>
                <InkButton className="">
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
