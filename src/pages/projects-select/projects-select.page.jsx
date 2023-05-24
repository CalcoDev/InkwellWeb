import { useState } from "react";
import { useRecoilState } from "recoil";
import userState from "../../recoil/atoms/user-state.atom";
import { useEffect } from "react";
import {
    createProject,
    getUserProjects,
} from "../../firebase/firebase.utility";
import { useNavigate } from "react-router-dom";
import Navigation from "../../components/navigation/navigation.component";
import ProjectCard from "../../components/project-card/project-card.component";
import InkModal from "../../components/ink-modal/ink-modal.component";
import InkInput from "../../components/ink-input/ink-input.component";
import InkButton from "../../components/ink-button/ink-button.component";

const ProjectsSelect = () => {
    const [user] = useRecoilState(userState);
    const [projects, setProjects] = useState(null);
    const navigate = useNavigate();

    const [isModalHidden, setModalHidden] = useState(true);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [errorCode, setErrorCode] = useState(null);

    const handleCreateProject = async () => {
        const res = await createProject(user.uid, name, description);
        if (!res.succeded) {
            console.log(res.errorCode);
            return;
        }

        console.log(res.project);

        setModalHidden(true);
        setName("");
        setDescription("");
        setProjects([...projects, res.project]);
    };

    useEffect(() => {
        // if (!user.connected) {
        //     navigate("/sign-in");
        // }

        // TODO(calco): Show this on page.
        getUserProjects(user.uid).then(({ succeded, errorCode, projects }) => {
            if (!succeded) {
                setErrorCode(errorCode);
                return;
            }

            setProjects(projects);
        });
    }, []);

    return (
        <div className="h-screen">
            <div className="z-0 absolute h-screen spacer bg-[url('waves/projects_wave_top.svg')]"></div>
            <div className="z-0 absolute h-screen spacer bg-[url('waves/projects_wave_bottom.svg')]"></div>

            <InkModal
                title="Create Project"
                className="max-w-[45vw]"
                hidden={isModalHidden}
                setHidden={setModalHidden}
            >
                <div className="flex flex-col justify-between h-full w-full items-center transition duration-300 ease-in-out sm:p-8 md:p-16 lg:p-32">
                    <div className="w-1/2 h-2/3 flex flex-col">
                        <InkInput
                            className="mb-8"
                            label="Name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            lightTheme={false}
                        />

                        <InkInput
                            className="flex-1"
                            label="Description"
                            type="textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            lightTheme={false}
                        />
                    </div>

                    <div className="text-center">
                        {errorCode && (
                            <p className="text-ink-red text-xs text-center mb-4">
                                {errorCode}
                            </p>
                        )}

                        <InkButton
                            onClick={handleCreateProject}
                            lightTheme={false}
                        >
                            Create project
                        </InkButton>
                    </div>
                </div>
            </InkModal>

            <Navigation className="z-0" />

            <div className="relative z-20 bg-ink-transparent pt-[15vh] h-full w-[60%] mx-auto">
                <h1 className="z-20 mix-blend-difference text-ink-light-grey font-ink-catamaran text-xl">
                    Your Inkwell projects:
                </h1>

                <div className="grid md:grid-cols-3 gap-12">
                    <div
                        className="
                            active:scale-90 hover:cursor-pointer hover:scale-110 transition-all ease-in-out duration-300 
                            rounded-md bg-ink-blue flex flex-col justify-center items-center p-4 
                            min-h-[8rem] h-[30vh] max-h-[16rem]
                            "
                        onClick={() => setModalHidden(false)}
                    >
                        <img
                            className="mb-4"
                            src="icons/plus.svg"
                            alt="Add project"
                        />
                        <h1 className="text-ink-white font-ink-catamaran text-2xl font-semibold">
                            New project?
                        </h1>
                    </div>

                    <div className="active:scale-90 hover:cursor-pointer hover:scale-110 transition-all ease-in-out duration-300 rounded-md bg-ink-blue flex flex-col justify-center items-center p-4 min-h-[8rem] h-[30vh] max-h-[16rem]">
                        <img
                            className="mb-4"
                            src="icons/plus.svg"
                            alt="Add project"
                        />
                        <h1 className="text-ink-white font-ink-catamaran text-2xl font-semibold">
                            Load local?
                        </h1>
                    </div>

                    {projects !== null &&
                        projects.length > 0 &&
                        projects.map(
                            ({ name, description, authors, createdAt }, i) => (
                                <ProjectCard
                                    name={name}
                                    description={description}
                                    authors={authors}
                                    date={new Date(
                                        createdAt.seconds * 1000
                                    ).toLocaleDateString()}
                                    key={i}
                                />
                            )
                        )}
                </div>
            </div>
        </div>
    );
};

export default ProjectsSelect;
