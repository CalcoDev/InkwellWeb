import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import projectState from "../../recoil/atoms/project-state.atom";
import { useEffect } from "react";
import ImageCard from "../../components/image-card/image-card.component";
import {
    TEST_addFirebaseEntry,
    TEST_deleteFirebaseEntry,
    TEST_updateFirebaseEntry,
    convertFirebaseProjectToProjectState,
    getFirebaseProjectData,
    loadFirebaseProjectToProjectState,
    subscribeToProject,
} from "../../firebase/firebase.utility";
import ProjectPageContainer from "../../components/project-page-container/project-page-container.component";

const ProjectDashboard = () => {
    const { projectId } = useParams();
    const [project, setProject] = useRecoilState(projectState);
    const navigate = useNavigate();

    let unsubscribeFromProject = () => {
        console.log(
            "Tried unsubscribing from project but method wasn't assigned!"
        );
    };

    const onProjectDataChange = async (projectData) => {
        const localHalf = {
            uid: projectId,
            local: false,
            tables: [],
            ...projectData,
        };

        const res = await loadFirebaseProjectToProjectState(projectId);
        if (!res.succeded) {
            console.error(
                "Failed to load project from firebase to project state!"
            );
            return;
        }

        const fullProj = {
            ...localHalf,
            ...res.project,
        };
        console.log(fullProj);

        setProject(fullProj);
    };

    const onComponentMount = async () => {
        if (project.local || projectId === "local") return;

        console.log("Trying to load project: ", projectId);

        let res = await getFirebaseProjectData(projectId);
        if (!res.succeded) {
            console.error("Failed to get project data from firebase!");
            return;
        }

        const localHalf = {
            uid: projectId,
            local: false,
            tables: [],
            ...res.project,
        };

        res = await loadFirebaseProjectToProjectState(projectId);
        if (!res.succeded) {
            console.error(
                "Failed to load project from firebase to project state!"
            );
            return;
        }

        const fullProj = {
            ...localHalf,
            ...res.project,
        };
        setProject(fullProj);
    };

    const onComponentUnmount = () => {};

    useEffect(() => {
        onComponentMount();

        return onComponentUnmount;
    }, []);

    return (
        <ProjectPageContainer project={project}>
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
                        navigate(`/project/${project.uid}/views/spreadsheet`)
                    }
                />
                <ImageCard
                    imageUrl="/misc/card_diagram.png"
                    description="Not the most efficient, but the easiest to get used to approach. --TO BE ADDED--"
                    title="Diagram"
                    onClick={() =>
                        navigate(`/project/${project.uid}/views/diagram`)
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
                    onClick={() => navigate(`/project/${project.uid}/users`)}
                />
                <ImageCard
                    imageUrl="/misc/card_sample.png"
                    description="Change the name, description, and other settings of this project."
                    solidColour="bg-ink-red"
                    title="Project Settings"
                    onClick={() => navigate(`/project/${project.uid}/settings`)}
                />
            </div>
        </ProjectPageContainer>
    );
};

export default ProjectDashboard;
