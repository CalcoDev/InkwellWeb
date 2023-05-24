import { useRecoilState } from "recoil";
import userState from "../../recoil/atoms/user-state.atom";

const ProjectsSelect = () => {
    const [user] = useRecoilState(userState);

    return <div>Hello, {user.displayName}! SUCK BALLS</div>;
};

export default ProjectsSelect;
