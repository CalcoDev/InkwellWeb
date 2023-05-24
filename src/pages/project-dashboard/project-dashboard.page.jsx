import { useParams } from "react-router-dom";

const ProjectDashboard = () => {
    const { projectId } = useParams();

    return <div>ID: {projectId}</div>;
};

export default ProjectDashboard;
