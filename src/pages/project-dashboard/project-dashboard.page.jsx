import { Link, useNavigate, useParams } from "react-router-dom";
import TopNavigation from "../../components/top-navigation/top-navigation.component";
import { useRecoilState } from "recoil";
import projectState from "../../recoil/atoms/project-state.atom";
import { useEffect } from "react";
import ImageCard from "../../components/image-card/image-card.component";
import DashboardOption from "../../components/dashboard-option/dashbopard-option.component";
import {
    convertFirebaseProjectToProjectState,
    subscribeToProject,
} from "../../firebase/firebase.utility";
import SideDashboard from "../../components/side-dashboard/side-dashboard.component";

const getDateFormatted = (createdAt) => {
    const date = new Date(createdAt.seconds * 1000);
    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
    ];

    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();

    return `${day} ${monthNames[month]} ${year}`;
};

const ProjectDashboard = () => {
    const { projectId } = useParams();
    const [project, setProject] = useRecoilState(projectState);
    const navigate = useNavigate();

    let unsubscribeFromProject = () =>
        console.log(
            "Tried unsubscribing from project but method wasn't assigned!"
        );

    const onProjectDataChange = (projectData) => {
        // console.log("Project data changed: ", projectData);

        setProject(convertFirebaseProjectToProjectState(projectData));
    };

    const onComponentMount = async () => {
        // TODO(calco): load project from firestore if not loaded already

        if (project.uid !== projectId && !project.local) {
            unsubscribeFromProject = await subscribeToProject(
                projectId,
                onProjectDataChange
            );
        }
    };

    const onComponentUnmount = () => {
        unsubscribeFromProject();
    };

    useEffect(() => {
        onComponentMount();

        return onComponentUnmount;
    }, []);

    return (
        <div className="h-screen flex">
            <SideDashboard />

            <div className="w-full h-full flex flex-col justify-between">
                <div className="w-full sm:px-12 md:px-32 2xl:px-80 flex-[2] bg-ink-blue flex flex-col justify-around">
                    <div>
                        <h1 className="text-ink-white text-6xl font-bold font-ink-fira">
                            {project.name}
                        </h1>
                        <p className="text-ink-white text-lg font-light font-ink-catamaran">
                            {project.description}
                        </p>
                    </div>

                    <div className="flex justify-between">
                        <img
                            src="/icons/user_placeholder.png"
                            alt="User profile"
                            className="h-full rounded-full border-2 border-ink-white"
                        />
                        <p className="text-ink-white text-lg font-ink-fira">
                            {getDateFormatted(project.createdAt)}
                        </p>
                    </div>
                </div>

                <div className="w-full md:px-12 md:py-6 lg:px-16 lg:py-8 xl:px-24 xl:py-12 flex-[3] bg-ink-white">
                    <h1 className="text-ink-dark-light-blue font-ink-fira font-normal mb-2 text-xl">
                        Views
                    </h1>
                    <div className="grid grid-cols-3 gap-12">
                        <ImageCard
                            imageUrl="/misc/card_tables.png"
                            description="The classic approach. Balance between ease-of-use and efficiency."
                            title="Tables"
                            onClick={() =>
                                navigate(`/project/${project.uid}/views/tables`)
                            }
                        />
                        <ImageCard
                            imageUrl="/misc/card_spreadsheet.png"
                            description="The most efficient, yet hardest to get used to approach. --TO BE ADDED--"
                            title="Spreadsheet"
                            onClick={() =>
                                navigate(
                                    `/project/${project.uid}/views/spreadsheet`
                                )
                            }
                        />
                        <ImageCard
                            imageUrl="/misc/card_diagram.png"
                            description="Not the most efficient, but the easiest to get used to approach. --TO BE ADDED--"
                            title="Diagram"
                            onClick={() =>
                                navigate(
                                    `/project/${project.uid}/views/diagram`
                                )
                            }
                        />
                    </div>

                    <h1 className="text-ink-dark-light-blue font-ink-fira font-normal mt-4 mb-2 text-xl">
                        Management
                    </h1>
                    <div className="grid grid-cols-2 gap-12">
                        <ImageCard
                            imageUrl="/misc/card_sample.png"
                            description="Add, remove and inspect members of this project."
                            solidColour="bg-ink-light-orange"
                            title="Users"
                        />
                        <ImageCard
                            imageUrl="/misc/card_sample.png"
                            description="Change the name, description, and other settings of this project."
                            solidColour="bg-ink-red"
                            title="Project Settings"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDashboard;
