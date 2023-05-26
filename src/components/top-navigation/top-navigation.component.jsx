import { useRecoilState } from "recoil";
import userState, {
    defaultUserState,
} from "../../recoil/atoms/user-state.atom";
import { Link, useNavigate } from "react-router-dom";
import InkModal from "../ink-modal/ink-modal.component";
import InkButton from "../ink-button/ink-button.component";
import { useState } from "react";
import { signOut } from "../../firebase/firebase.utility";
import projectState, {
    defaultProjectState,
} from "../../recoil/atoms/project-state.atom";

const TopNavigation = ({ className }) => {
    const [_, setGlobalUser] = useRecoilState(userState);
    const [__, setGlobalProjectState] = useRecoilState(projectState);

    const [hideModal, setHideModal] = useState(true);
    const [{ photoURL }] = useRecoilState(userState);

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSignOut = async () => {
        const res = await signOut();

        if (res.error) {
            setError(res.error);
            return;
        }

        setHideModal(true);
        setGlobalUser(defaultUserState);
        setGlobalProjectState(defaultProjectState);
        navigate("/");
    };

    return (
        <>
            <InkModal
                className="z-50"
                hidden={hideModal}
                setHidden={setHideModal}
                title="Account Settings"
            >
                {error && (
                    <p className="text-ink-red text-xs text-center mb-4">
                        {error}
                    </p>
                )}

                <InkButton lightTheme={false} onClick={handleSignOut}>
                    Sign Out
                </InkButton>
            </InkModal>

            <div
                className={`${
                    className || ""
                } fixed left-1/2 -translate-x-1/2 bg-ink-transparent w-[98vw] h-[9vh] py-[2vh] mx-auto flex justify-between`}
            >
                <Link
                    to="/projects"
                    className="w-fit aspect-square flex items-center"
                >
                    <img
                        className="rounded-full h-full mr-4"
                        src="/logos/logo_512x_round.png"
                        alt="Inkwell logo"
                    />
                    <h1 className="text-ink-white text-2xl font-ink-libre text-center">
                        Inkwell
                    </h1>
                </Link>

                <div className="flex">
                    {/* TODO(calco): ADD LINK TO DOCUMENTATION AND REPLACE WITH A */}
                    <Link to="/projects">
                        <img
                            src="/icons/documentation.png"
                            alt="Documentation"
                            className="h-full border-2 border-ink-white mr-4"
                        />
                    </Link>

                    <img
                        src={photoURL}
                        alt="User profile"
                        className="h-full rounded-full border-2 border-ink-white hover:cursor-pointer"
                        onClick={() => setHideModal(false)}
                    />
                </div>
            </div>
        </>
    );
};

export default TopNavigation;
