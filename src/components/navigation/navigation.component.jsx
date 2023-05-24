import { useRecoilState } from "recoil";
import userState from "../../recoil/atoms/user-state.atom";
import { Link } from "react-router-dom";

const Navigation = ({ className }) => {
    const [{ photoURL }] = useRecoilState(userState);

    return (
        <div
            className={`${
                className || ""
            } fixed left-1/2 -translate-x-1/2 bg-ink-transparent w-[90%] h-[9vh] py-[2vh] mx-auto flex justify-between`}
        >
            <Link
                to="/projects"
                className="w-fit aspect-square flex items-center"
            >
                <img
                    className="rounded-full h-full mr-4"
                    src="logos/logo_512x_round.png"
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
                        src="icons/documentation.png"
                        alt="Documentation"
                        className="h-full border-2 border-ink-white mr-4"
                    />
                </Link>

                <img
                    src={photoURL}
                    alt="User profile"
                    className="h-full rounded-full border-2 border-ink-white hover:cursor-pointer"
                />
            </div>
        </div>
    );
};

export default Navigation;
