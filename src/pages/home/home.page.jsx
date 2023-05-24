import { useRecoilState } from "recoil";
import userState from "../../recoil/atoms/user-state.atom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
    const [{ connected }] = useRecoilState(userState);
    const navigate = useNavigate();

    // TODO(calco): Have an actual homepage, showcasing the product, explaining it nicely etc. Design based website.

    useEffect(() => {
        navigate(connected ? "/projects" : "/sign-in");
    }, []);

    return <></>;
};

export default Home;
