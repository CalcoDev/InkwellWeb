import { getDateFormatted } from "../../misc/date.utils";
import SideDashboard from "../side-dashboard/side-dashboard.component";

const ProjectPageContainer = ({ project, children }) => {
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
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ProjectPageContainer;
