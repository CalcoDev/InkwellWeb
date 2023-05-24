import { useRecoilState } from "recoil";
import userState from "../../recoil/atoms/user-state.atom";

const Home = () => {
    const [user, setUser] = useRecoilState(userState);

    return <div>connected: {user.connected ? "true" : "false"}</div>;
};

export default Home;
