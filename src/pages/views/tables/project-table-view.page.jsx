import SideDashboard from "../../../components/side-dashboard/side-dashboard.component";

const ProjectTableView = () => {
    return (
        <div className="h-screen flex">
            <SideDashboard />

            <div className="w-full h-full flex flex-col justify-between bg-ink-red"></div>
        </div>
    );
};

export default ProjectTableView;
