import { useRecoilState } from "recoil";
import ProjectPageContainer from "../../components/project-page-container/project-page-container.component";
import projectState from "../../recoil/atoms/project-state.atom";
import InkInput from "../../components/ink-input/ink-input.component";
import { useState } from "react";
import InkButton from "../../components/ink-button/ink-button.component";
import { useNavigate } from "react-router-dom";
import { updateProject } from "../../firebase/firebase.utility";

const ProjectSettings = () => {
    const [project, setProject] = useRecoilState(projectState);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [error, setError] = useState(null);

    const handleSave = async () => {
        if (name === "" || description === "") {
            setError("Please fill in all fields.");
            return;
        }

        setProject({
            ...project,
            name,
            description,
        });

        const res = await updateProject(project.uid, {
            name,
            description,
        });

        if (res.errorCode) {
            setError(res.errorMessage);
            return;
        }

        setError(null);
        setName("");
        setDescription("");
    };

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate("/project/" + project.uid);
    };

    return (
        <ProjectPageContainer project={project}>
            <h1 className="text-ink-dark-light-blue font-ink-fira font-normal mb-2 text-xl">
                Project Settings
            </h1>

            <InkInput
                className="mb-8"
                label="Project Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                lightTheme={false}
            />
            <InkInput
                className="mb-8 h-1/2"
                label="Description"
                type="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                lightTheme={false}
            />

            {error && (
                <p className="text-ink-red text-xs text-center mb-4">{error}</p>
            )}

            <div className="flex justify-center">
                <InkButton
                    className="mr-8"
                    lightTheme={false}
                    onClick={handleSave}
                >
                    SAVE
                </InkButton>
                <InkButton lightTheme={false} onClick={handleGoBack}>
                    GO BACK
                </InkButton>
            </div>
        </ProjectPageContainer>
    );
};

export default ProjectSettings;
