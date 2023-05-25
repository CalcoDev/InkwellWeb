import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import DashboardOption from "../dashboard-option/dashbopard-option.component";
import projectState from "../../recoil/atoms/project-state.atom";

const SideDashboard = () => {
    const [project] = useRecoilState(projectState);

    return (
        <div className="w-1/2 max-w-[500px] h-full min-w-[300px] bg-ink-dark-grey">
            <Link
                to="/projects"
                className="pl-[1vw] aspect-square flex items-center h-[9vh] py-[2vh]"
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

            <hr className="border-ink-light-grey mx-auto" />

            <DashboardOption
                className="my-3"
                imgSrc="/icons/home.png"
                title="Project Overview"
                linkTo={`/project/${project.uid}`}
            />

            <hr className="border-ink-light-grey mx-auto" />

            <h1 className="text-ink-light-grey text-lg font-ink-fira pl-[1vw] mt-2">
                Views
            </h1>

            <DashboardOption
                imgSrc="/icons/table.png"
                title="Tables"
                linkTo={`/project/${project.uid}/views/tables`}
            />

            <DashboardOption
                imgSrc="/icons/spreadsheet.png"
                title="Spreadsheet"
                linkTo={`/project/${project.uid}/views/spreadsheet`}
            />

            <DashboardOption
                imgSrc="/icons/diagram.png"
                title="Diagram"
                linkTo={`/project/${project.uid}/views/diagram`}
            />

            <h1 className="text-ink-light-grey text-lg font-ink-fira pl-[1vw] mt-2">
                Management
            </h1>

            <DashboardOption
                imgSrc="/icons/settings.png"
                title="Project Settings"
                linkTo={`/project/${project.uid}/settings`}
            />

            <DashboardOption
                imgSrc="/icons/user.png"
                title="Users & Members"
                linkTo={`/project/${project.uid}/users`}
            />
        </div>
    );
};

export default SideDashboard;
